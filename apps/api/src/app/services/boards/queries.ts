export { findBoard, findBoards };

function findBoards(sql: Function) {
  return sql`
    SELECT
      id,
      name,
      (SELECT array_to_json(array_agg(c)) FROM (
        SELECT
          id,
          name,
          (
            SELECT COALESCE(array_agg(t), '{}'::record[])
            FROM (
              SELECT id, name, description
              FROM tasks
              WHERE columns_id = columns.id
              ORDER BY position DESC
            ) t
          ) as tasks
        FROM columns
        WHERE boards_id = boards.id
        ORDER BY columns.position ASC
      ) as c) AS columns
    FROM boards
  `;
}

function findBoard(sql: Function, id: number) {
  return sql`
    SELECT
      id,
      name,
      (SELECT array_to_json(array_agg(c)) FROM (
        SELECT
          id,
          name,
          (
            SELECT COALESCE(array_agg(t), '{}'::record[])
            FROM (
              SELECT id, name, description
              FROM tasks
              WHERE columns_id = columns.id
              ORDER BY position DESC
            ) t
          ) as tasks
        FROM columns
        WHERE boards_id = boards.id
        ORDER BY columns.position ASC
      ) as c) AS columns
    FROM boards
    WHERE boards.id = ${id}
  `;
}
