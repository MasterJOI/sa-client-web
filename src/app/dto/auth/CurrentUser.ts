import {Permission} from '../groups_permissions/Permission';

export interface CurrentUser {
  id: string;
  username: string;
  name: string;
  email: string;
  permissions: Permission[]
}
