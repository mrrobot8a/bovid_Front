import { Role } from "../../../../auth/interfaces";

export interface UserModelTable {
  id: number;
  fullname? :String;
  firtsName? :String;
  lastName? :String;
  password? :String;
  position? :String;
  numberPhone? :String;
  email :String;
  roles :any[];
  enabled :boolean;
}
