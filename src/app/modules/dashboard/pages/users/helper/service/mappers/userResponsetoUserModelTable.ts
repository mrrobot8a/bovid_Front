import { inject } from "@angular/core";
import { Content, UserModelTable } from "../../../interface";
import { EncryptionService } from "../EncryptionServiceUtil.service";




export function mapToUserModelTable(data: Content[]): UserModelTable[] {
  console.log('data', data)
  console.log('mapToUserModelTable:', data.map((item) =>
  item.roles.map((role) => role.authority).join(',')));

  console.log('passwordDecode:', data.map((item) => {

    return EncryptionService.decryptData(item.password!);


  }));




  return data.map((item) => ({
    id: item.id,
    firtsName: item.firtsName,
    lastName: item.lastName,
    email: item.email,
    password: EncryptionService.decryptData(item.password!),
    // roles: item.roles.map((role) => role.authority).join(','),
    roles: item.roles.map((role) => role.authority),
    position: item.position,
    numberPhone: item.numberPhone,
    enabled: item.enabled

  }));
}

