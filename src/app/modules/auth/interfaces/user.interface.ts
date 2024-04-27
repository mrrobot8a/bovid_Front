import { Role } from "./role.interface";

export interface User {
  fullname?: string;
  firstName?: string;
  lastName?: string;
  email:    string;
  roles:    Role[];
  enabled:  boolean;
}
