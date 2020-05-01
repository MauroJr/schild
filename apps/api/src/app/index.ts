import { fastify } from 'fastify';
import { messageService } from './services';

export default {
  start,
  stop
};

const app = function(fastify, opts, next) {
  fastify.register(messageService);

  next();
};

// Instantiate Fastify with some config
const server = fastify({
  logger: { level: process.env.LOG_LEVEL || 'fatal' },
  pluginTimeout: 10000,
  ignoreTrailingSlash: true
});

// Register application as a normal plugin.
server.register(app);

async function start() {
  await server.listen(3333);
  console.log('Server successfully started!');
}

async function stop() {
  await server.close();
  console.log('Server successfully closed!');
}
