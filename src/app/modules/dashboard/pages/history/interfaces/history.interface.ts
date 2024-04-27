export interface Historial {
  historial: Historial;
  content: Session[];
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

export interface Session {
  ipComputer: string;
  fechaIncio: string;
  users: User;
  accion: string;
  logoutDate?: any;
}

export interface User {
  fullname?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roles: Role[];
  enabled: boolean;
}

export interface Role {
  status: boolean;
  authority: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}
