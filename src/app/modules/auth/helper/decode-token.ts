import { Role } from "../interfaces/role.interface";
import { User } from "../interfaces/user.interface";

export function decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
}
// Este método transforma el objeto decodificado del JWT a un objeto User
export function mapTokenToUser(token: string): User {
  const tokenPayload = decodeToken(token);
  // Considerando que `roles` puede ser un string con múltiples roles separados por comas
  // Dividimos el string en un array y mapeamos cada valor a un objeto Role
  const rolesArray: Role[] = tokenPayload.roles.split(",").map((roleName: string) => ({
    status: true, // Asumiendo que cada rol está activo por defecto
    authority: roleName.trim(), // Usamos trim() para eliminar espacios en blanco antes o después del nombre del rol
  }));

  // Convertimos el objeto decodificado a tu interfaz User
  return {
    fullname: tokenPayload.fullname,
    email: tokenPayload.email,
    roles: rolesArray,
    enabled: tokenPayload.isEnabled,
  };
}

export function hasTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}
