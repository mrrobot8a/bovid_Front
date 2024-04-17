import { RoleModelTable } from "../../interface/roleModelTable.interface";
import { Content } from "../../interface/role_pegination_response.interface";


export function mapToRoleModelTable(data: Content[]): RoleModelTable[] {

  return data.map((item) => ({
    id: item.id,
    authority: item.authority,
    description: item.description,
    status: item.status,
    codRole: item.codRole
  }));



}
