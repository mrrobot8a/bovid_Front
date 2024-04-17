export interface RolePegableResponse {
    success:  boolean;
    roles:    Roles;
    menssage: string;
}

export interface Roles {
    content:          Content[];
    pageable:         Pageable;
    last:             boolean;
    totalElements:    number;
    totalPages:       number;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    first:            boolean;
    empty:            boolean;
}

export interface Content {
    id:           number;
    codRole?:     string;
    status:       boolean;
    description?: string;
    authority?:   string;
    users:        any[];
}

export interface Pageable {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    paged:      boolean;
    unpaged:    boolean;
}

export interface Sort {
    empty:    boolean;
    sorted:   boolean;
    unsorted: boolean;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toRoleModelTable(json: string): RolePegableResponse {
        return JSON.parse(json);
    }

    public static roleModelTableToJson(value: RolePegableResponse): string {
        return JSON.stringify(value);
    }
}
