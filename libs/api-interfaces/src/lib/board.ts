import { Colunm } from './column';

export interface Board {
  id: number;
  name: string;
  columns: Colunm[];
}
