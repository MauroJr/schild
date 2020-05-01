/* eslint-disable */
'use strict';

const path = require('path');
const postgres = require('postgres');
const migrate = require('migrate');

const sql = postgres();

const stateStore = createPostgresStateStorage(sql);

const migrationsDirectory = path.resolve(__dirname, '../src/migrations');

const [command] = process.argv.slice(2);

new Promise((resolve, reject) => {
  migrate.load(
    {
      stateStore,
      migrationsDirectory
    },
    (err, set) => {
      if (err) {
        reject(err);
      }

      if (typeof set[command] !== 'function') {
        reject(new Error('Command is not a function'));
      }

      // inject the database connection into migrations runners
      set.migrations.map(migration => {
        const cmd = migration[command];

        migration[command] = async (...args) => await cmd(sql);
        return migration;
      });

      set[command](err => {
        if (err) reject(err);
        resolve();
      });
    }
  );
})
  .then(() => {
    console.log(`migrations "${command}" successfully ran`);
    sql.end({ timeout: null });
    process.exit(0);
  })
  .catch(error => {
    console.error(error.stack);
    sql.end({ timeout: null });
    process.exit(1);
  });

function createPostgresStateStorage(sql) {
  return {
    load,
    save
  };

  async function load(fn) {
    await ensureMigrationsTable();

    // Load the single row of migration data from the database
    const rows = await sql`SELECT data FROM migrations`;

    if (rows.length !== 1) {
      console.log(
        'Cannot read migrations from database. If this is the first time you run migrations, then this is normal.'
      );
      return fn(null, {});
    }

    // Call callback with new migration data object
    fn(null, rows[0].data);
  }

  async function save(set, fn) {
    await ensureMigrationsTable();

    const migrationMetaData = {
      lastRun: set.lastRun,
      migrations: set.migrations
    };

    await sql`
      INSERT INTO migrations (id, data)
      VALUES (1, ${sql.json(migrationMetaData)})
      ON CONFLICT (id) DO UPDATE SET data = ${sql.json(migrationMetaData)}
      `;

    fn();
  }

  async function ensureMigrationsTable() {
    return sql`CREATE TABLE IF NOT EXISTS migrations (id integer PRIMARY KEY, data jsonb NOT NULL)`;
  }
}
