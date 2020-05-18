import { TasksPostBody } from '.';

export function findTasks(sql: Function, columnId: number) {
  return sql`
    SELECT id, name, description
    FROM tasks
    WHERE columns_id = ${columnId}
  `;
}

export function insertTask(
  sql: any,
  { columnId, name, description }: TasksPostBody
) {
  return sql.begin(async sql => {
    const [{ position }] = await sql`
      SELECT position
      FROM tasks
      WHERE columns_id = ${columnId}
      ORDER BY position DESC
      FETCH FIRST 1 ROWS ONLY
    `;

    const [task] = await sql`
      INSERT INTO tasks (
        name,
        description,
        columns_id,
        position
      ) VALUES (
        ${name},
        ${description},
        ${columnId},
        ${position + 1}
      )
      RETURNING id, name, description
    `;

    return task;
  });
}

export async function updateTask(sql: Function, task) {
  const [updatedTask] = await sql`
    UPDATE tasks SET ${sql(task, 'name', 'description')}
    WHERE id = ${task.id}
    RETURNING id, name, description
  `;

  return updatedTask;
}

export function reorderTasks(sql: any, { id, newPosition }) {
  return sql.begin(async sql => {
    const [{ position, columns_id: columnId }] = await sql`
      SELECT position, columns_id
      FROM tasks
      WHERE id = ${id}
    `;

    await sql`
      UPDATE tasks SET position = position - 1
      WHERE columns_id = ${columnId} AND position >= ${position}
    `;

    await sql`
      UPDATE tasks SET position = position + 1
      WHERE columns_id = ${columnId} AND position >= ${newPosition}
    `;

    await sql`
      UPDATE tasks SET position = ${newPosition}
      WHERE id = ${id}
    `;

    return sql`
      SELECT id, name, description
      FROM tasks
      WHERE columns_id = ${columnId}
      ORDER BY position ASC
    `;
  });
}
