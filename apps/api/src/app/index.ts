import { fastify, FastifyInstance } from 'fastify';
import { messageService, boardsService } from './services';
import { postgresPlugin } from './plugins/postgres';

export default {
  start,
  stop
};

const app = function(fastify: FastifyInstance, opts, next) {
  fastify.register(boardsService);
  fastify.register(messageService);

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

// Register application as a normal plugin.
server.register(app);

async function start() {
  await server.listen(Number(process.env.API_PORT));
  console.log('Server successfully started!');
}

async function stop() {
  await server.close();
  console.log('Server successfully closed!');
}
