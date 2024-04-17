import { Role } from "./role.interface";

export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  role: Role[];
  numberPhone: string;
  password: string;
  position: string;
  enabled: boolean;
}
