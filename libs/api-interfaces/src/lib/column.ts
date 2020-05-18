import { Task } from './task';

export interface Colunm {
  id: number;
  name: string;
  tasks: Task[];
}
