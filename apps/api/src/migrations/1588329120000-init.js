/* eslint-disable */
'use strict';

module.exports = { up, down };

async function up(sql) {
  await sql`
    CREATE TABLE boards (
      id serial  NOT NULL,
      name text  NULL,
      CONSTRAINT boards_pk PRIMARY KEY (id)
    );
  `;

  await sql`
    CREATE TABLE columns (
      id serial  NOT NULL,
      name text  NULL,
      position int  NULL,
      boards_id int  NOT NULL,
      CONSTRAINT columns_ak_1 UNIQUE (position) DEFERRABLE  INITIALLY DEFERRED,
      CONSTRAINT columns_pk PRIMARY KEY (id)
    );
  `;

  await sql`
    CREATE TABLE tasks (
      id serial  NOT NULL,
      name text  NULL,
      description text  NULL,
      columns_id int  NOT NULL,
      position int  NULL,
      CONSTRAINT tasks_ak_1 UNIQUE (columns_id, position) DEFERRABLE  INITIALLY DEFERRED,
      CONSTRAINT tasks_pk PRIMARY KEY (id)
    );
  `;

  // foreign keys
  // Reference: columns_boards (table: columns)
  await sql`
    ALTER TABLE columns ADD CONSTRAINT columns_boards
      FOREIGN KEY (boards_id)
      REFERENCES boards (id)
      NOT DEFERRABLE
      INITIALLY IMMEDIATE
    ;
  `;

  // Reference: tasks_columns (table: tasks)
  await sql`
    ALTER TABLE tasks ADD CONSTRAINT tasks_columns
      FOREIGN KEY (columns_id)
      REFERENCES columns (id)
      NOT DEFERRABLE
      INITIALLY IMMEDIATE
    ;
  `;

  // seed initial data
  await sql`
    INSERT INTO boards(name) VALUES ('default');
  `;

  await sql`
    INSERT INTO
	    columns(name, "position", boards_id)
    VALUES
	    ('ToDo', 1, 1),
	    ('In Progress', 2, 1),
	    ('Done', 3, 1);
  `;

  await sql`
    INSERT INTO tasks
	    (name, description, columns_id, "position")
    VALUES
	    ('Task1', 'Task1 Description', 1, 1),
	    ('Task2', 'Task2 Description', 1, 2),
      ('Task3', 'Task3 Description', 2, 1);
  `;
}

async function down(sql) {
  await sql`DROP TABLE migrations CASCADE;`;
  await sql`DROP TABLE tasks CASCADE;`;
  await sql`DROP TABLE columns CASCADE;`;
  await sql`DROP TABLE boards CASCADE;`;
}
