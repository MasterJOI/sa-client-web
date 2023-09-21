import {Permission} from './Permission';

export interface Group {
  name: string;
  permissions: Permission[];
}
