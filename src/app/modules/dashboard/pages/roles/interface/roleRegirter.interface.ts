export interface RoleRegirter {
  role:    Role;
  success: boolean;
  mensaje: string;
}

export interface Role {
  codRole:     string;
  status:      boolean;
  description: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toRoleRegirter(json: string): RoleRegirter {
      return JSON.parse(json);
  }

  public static roleRegirterToJson(value: RoleRegirter): string {
      return JSON.stringify(value);
  }
}
