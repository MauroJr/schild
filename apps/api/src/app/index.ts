import { fastify, FastifyInstance } from 'fastify';
import formBodyPlugin from 'fastify-formbody';

import { messageService, boardsService, columnsService } from './services';
import { postgresPlugin } from './plugins/postgres';

export default {
  start,
  stop
};

const app = function(fastify: FastifyInstance, opts, next) {
  fastify.register(boardsService);
  fastify.register(messageService);
  fastify.register(columnsService);

  next();
};

// Instantiate Fastify with some config
const server = fastify({
  logger: { level: process.env.LOG_LEVEL || 'fatal' },
  pluginTimeout: 10000,
  ignoreTrailingSlash: true
});

// Register plugins
server.register(postgresPlugin);
server.register(formBodyPlugin);

// Register application as a normal plugin.
server.register(app, { prefix: '/api' });

async function start() {
  await server.listen(Number(process.env.API_PORT));
  console.log('Server successfully started!');
}

async function stop() {
  await server.close();
  console.log('Server successfully closed!');
}
