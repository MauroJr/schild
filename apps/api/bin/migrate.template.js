/* eslint-disable */
'use strict';

module.exports = { up, down };

async function up(sql) {
  return sql`select 'migrate the database here'`;
}

async function down(sql) {
  return sql`select 'rollback the migration here'`;
}
