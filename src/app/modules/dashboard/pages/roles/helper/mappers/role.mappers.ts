import { Role } from "../../../../../../shared/interface/role.interface";

export  function mapRoleFromApiToRole(roleArray: string[] ): Role[] {
  return roleArray.map((role) => {
    return {
      authority: role,
      status: true,
    }
  });
}
