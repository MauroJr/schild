'use strict';
import { FastifyInstance } from 'fastify';
import {
  findColumns,
  insertColumn,
  updateColumn,
  reorderColumns
} from './queries';

export interface ColumnsParams {
  id: number;
}

export interface ColumnsGetQuerystring {
  boardId: number;
  position?: number;
}

export interface ColumnsPostBody {
  boardId: number;
  name: string;
}

export interface ColumnsPatchBody {
  name: string;
}

export interface ColumnsReorderBody {
  id: number;
  newPosition: number;
}

export async function columnsService(server: FastifyInstance) {
  const { sql } = server;

  server.get<{ Querystring: ColumnsGetQuerystring }>(
    '/columns',
    async request => {
      return findColumns(sql, request.query.boardId);
    }
  );

  server.post<{ Body: ColumnsPostBody }>('/columns', async request => {
    return insertColumn(sql, request.body);
  });

  server.patch<{ Body: ColumnsPatchBody; Params: ColumnsParams }>(
    '/columns/:id',
    async request => {
      return updateColumn(sql, { ...request.params, ...request.body });
    }
  );

  server.post<{ Body: ColumnsReorderBody }>(
    '/columns/reorder',
    async request => {
      return reorderColumns(sql, request.body);
    }
  );
}
