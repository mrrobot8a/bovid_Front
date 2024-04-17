import { Role } from '../../history/interfaces/history.interface';
export interface RoleModelTable {

  id: number;
  authority?: string;
  description?: string;
  status: boolean;
  codRole?: string;
}
