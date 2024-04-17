import { Role } from "../../../../../shared/interface/role.interface";

export interface UserRegistration {
  id: number;
  firtsName: string;
  lastName: string;
  email: string;
  roles: Role[];
  numberPhone?: string;
  password?: string;
  position?: string;
  enabled: boolean;
}
