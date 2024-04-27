import { Role } from "../../../../auth/interfaces";

export interface UserPegableResponse {
  mensaje: string;
  users: Users;
}

export interface Users {
  content: Content[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Content {
  id: number;
  fullname?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  numberPhone?: string;
  position?: string;
  email: string;
  roles: Role[];
  enabled: boolean;
}


export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toUserModelTable(json: string): UserPegableResponse {
    return JSON.parse(json);
  }

  public static userModelTableToJson(value: UserPegableResponse): string {
    return JSON.stringify(value);
  }
}
