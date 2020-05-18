'use strict';
import { FastifyInstance } from 'fastify';
import {
  findTasks,
  insertTask,
  updateTask,
  deleteTask,
  moveTask
} from './queries';

export interface TasksParams {
  id: number;
}

export interface TasksGetQuerystring {
  columnId: number;
}

export interface TasksPostBody {
  columnId: number;
  name: string;
  description?: string;
}

export interface TasksPatchBody {
  id: number;
  name?: string;
  description?: string;
}

export interface TasksReorderBody {
  id: number;
  toPosition: number;
}

export interface TasksMoveBody {
  id: number;
  toColumn: number;
  toPosition: number;
}

export async function tasksService(server: FastifyInstance) {
  const { sql } = server;

  server.get<{ Querystring: TasksGetQuerystring }>('/tasks', async request => {
    return findTasks(sql, request.query.columnId);
  });

  server.post<{ Body: TasksPostBody }>('/tasks', async request => {
    return insertTask(sql, request.body);
  });

  server.patch<{ Body: TasksPatchBody; Params: TasksParams }>(
    '/tasks/:id',
    async request => {
      return updateTask(sql, { ...request.params, ...request.body });
    }
  );

  server.delete<{ Params: TasksParams }>('/tasks/:id', async request => {
    return deleteTask(sql, request.params.id);
  });

  server.post<{ Body: TasksReorderBody }>('/tasks/reorder', async request => {
    return moveTask(sql, request.body);
  });

  server.post<{ Body: TasksMoveBody }>('/tasks/move', async request => {
    return moveTask(sql, request.body);
  });
}
