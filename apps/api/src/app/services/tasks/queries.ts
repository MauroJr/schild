import { TasksPostBody, TasksMoveBody } from '.';

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

export async function deleteTask(sql: Function, id: number) {
  return sql`
    DELETE FROM tasks
    WHERE id = ${id}
  `;
}

export interface MoveOptions {
  id: number;
  toColumn?: number;
  toPosition: number;
}

export function moveTask(sql: any, { id, toColumn, toPosition }: MoveOptions) {
  return sql.begin(async sql => {
    const [{ position: fromPosition, columns_id: fromColumn }] = await sql`
      SELECT position, columns_id
      FROM tasks
      WHERE id = ${id}
    `;

    toColumn = toColumn || fromColumn;

    await sql`
      UPDATE tasks SET position = position - 1
      WHERE columns_id = ${fromColumn} AND position >= ${fromPosition}
    `;

    await sql`
      UPDATE tasks SET position = position + 1
      WHERE columns_id = ${toColumn} AND position >= ${toPosition}
    `;

    await sql`
      UPDATE tasks SET position = ${toPosition}, columns_id = ${toColumn}
      WHERE id = ${id}
    `;

    return sql`
      SELECT id, name, description
      FROM tasks
      WHERE columns_id = ${toColumn}
      ORDER BY position ASC
    `;
  });
}
