import { ColumnsPostBody, ColumnsPatchBody } from '.';

export function findColumns(sql: Function, boardId: number) {
  return sql`
    SELECT
      id,
      name
    FROM columns
    WHERE boards_id = ${boardId}
    ORDER BY position ASC
  `;
}

export function insertColumn(sql: any, { boardId, name }: ColumnsPostBody) {
  return sql.begin(async sql => {
    const [{ position }] = await sql`
      SELECT position
      FROM columns
      ORDER BY position DESC
      FETCH FIRST 1 ROWS ONLY
    `;

    const [column] = await sql`
      INSERT INTO columns (
        name,
        position,
        boards_id
      ) VALUES (
        ${name},
        ${position + 1},
        ${boardId}
      )
      RETURNING id, name, position
    `;

    return column;
  });
}

export async function updateColumn(sql: Function, column) {
  const [updatedColumn] = await sql`
    UPDATE columns SET ${sql(column, 'name')}
    WHERE id = ${column.id}
    RETURNING id, name, position
  `;

  return updatedColumn;
}

export function reorderColumns(sql: any, { id, newPosition }) {
  return sql.begin(async sql => {
    const [{ position, boards_id: boardId }] = await sql`
      SELECT position, boards_id
      FROM columns
      WHERE id = ${id}
    `;

    await sql`
      UPDATE columns SET position = position - 1
      WHERE boards_id = ${boardId} AND position >= ${position}
    `;

    await sql`
      UPDATE columns SET position = position + 1
      WHERE boards_id = ${boardId} AND position >= ${newPosition}
    `;

    await sql`
      UPDATE columns SET position = ${newPosition}
      WHERE id = ${id}
      RETURNING id, name, position
    `;

    return sql`
      SELECT id, name
      FROM columns
      WHERE boards_id = ${boardId}
      ORDER BY position ASC
    `;
  });
}
