import { FastifyPlugin } from 'fastify';
import * as fp from 'fastify-plugin';
import postgres from 'postgres';

// using declaration merging, add your plugin props to the appropriate fastify interfaces
declare module 'fastify' {
  interface FastifyInstance {
    sql: Function;
  }
}

export type Options = { [key: string]: string };

export interface Transform {
  column?: Function; // Transforms incoming column names
  value?: Function; // Transforms incoming row values
  row?: Function; // Transforms entire rows
}

export interface PostgresOptions {
  host?: string; // Postgres ip address or domain name
  port?: number; // Postgres server port
  path?: string; // unix socket path (usually '/tmp')
  database?: string; // Name of database to connect to
  username?: string; // Username of database user
  password?: string; // Password of database user
  ssl?: boolean | Options; // True, or options for tls.connect
  max?: number; // Max number of connections
  idle_timeout?: number; // Idle connection timeout in seconds
  connect_timeout?: number; // Connect timeout in seconds
  types?: []; // Array of custom types, see more below
  onnotice?: Function; // Defaults to console.log
  onparameter?: Function; // (key, value) when server param change
  debug?: Function; // Is called with (connection, query, params)
  transform?: Transform;
  connection?: Options; // Other connection parameters
}

// define plugin
const plugin: FastifyPlugin<PostgresOptions> = (fastify, options, done) => {
  fastify.decorate('sql', postgres(options));

  done();
};

// export plugin using fastify-plugin
export const postgresPlugin = fp(plugin, '3.x');
