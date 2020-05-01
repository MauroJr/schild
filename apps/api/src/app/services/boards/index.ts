'use strict';
import { FastifyInstance } from 'fastify';
import { findBoard, findBoards } from './queries';

export interface BoardsParams {
  id: number;
}

export async function boardsService(server: FastifyInstance) {
  const { sql } = server;

  server.get('/boards', async () => {
    return findBoards(sql);
  });

  server.get<{ Params: BoardsParams }>('/boards/:id', async request => {
    const [board] = await findBoard(sql, request.params.id);
    return board;
  });
}
