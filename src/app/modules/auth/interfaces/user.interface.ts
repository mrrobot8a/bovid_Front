import { Role } from "./role.interface";

export interface User {
  fullname?: string;
  firtsName?: string;
  lastName?: string;
  email:    string;
  roles:    Role[];
  enabled:  boolean;
}
