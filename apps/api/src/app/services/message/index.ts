'use strict';
import { FastifyInstance } from 'fastify';
import { Message } from '@schild/api-interfaces';

export async function messageService(server: FastifyInstance) {
  server.get(
    '/message',
    async (): Promise<Message> => {
      return { message: 'Welcome to api!' };
    }
  );
}
