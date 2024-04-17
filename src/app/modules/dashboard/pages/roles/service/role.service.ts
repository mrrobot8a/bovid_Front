import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../../environments/enviroments';
import { TokenService } from '../../../../../shared/util/token.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, map, of, switchMap, throwError } from 'rxjs';
import { RolePegableResponse } from '../interface/role_pegination_response.interface';
import { RoleRegirter } from '../interface/roleRegirter.interface';



@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor() { }

  private readonly baseUrl: string = environment.baseUrl;
  private tokenService = inject(TokenService);
  private AuthService = inject(AuthService);
  private http = inject(HttpClient);

  public getAllRoles(page?: number, size: number = 30): Observable<any> {
    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          return of(false); // Manejo adecuado de la ausencia de token
        }
        // http://localhost:8000/admin/get-all-roles
        const url = `${this.baseUrl}/admin/get-all-roles?page=${page}&size=${size}`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.http.get<RolePegableResponse>(url, { headers }).pipe(
          delay(3000), // Simular demora (si es necesario)
          map(resp => {
            console.log('service role response:', resp);
            return resp
          }),
          catchError(error => {
            console.log('service role error:', error);
            if (error.status === 0) {
              console.log('Error 0');
              return throwError(() => new Error('Error en el servidor'));
            }
            if (error.status === 403) {
              console.log('Error 403');
              this.AuthService.onLogout().subscribe();
              return throwError(() => new Error(error.error));
            }
            return throwError(() => new Error(error.error));
          })
        );
      }),
      catchError(error => {
        console.error('Error en el proceso de obtención del token o en la petición HTTP', error);
        return throwError(() => error);
      })
    );
  }

  public saveRole(role: any): Observable<any> {
    console.log('role:', role);
    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          return of(false); // Manejo adecuado de la ausencia de token
        }
        // http://localhost:8000/admin/create-role
        const url = `${this.baseUrl}/admin/register-Role`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.http.post<RoleRegirter>(url, role, { headers }).pipe(
          delay(3000), // Simular demora (si es necesario)
          map(resp => {
            console.log('service role response:', resp);
            return resp
          }),
          catchError(error => {
            console.log('service role error:', error);
            if (error.status === 0) {
              console.log('Error 0');
              return throwError(() => new Error('Error en el servidor'));
            }
            if (error.status === 403) {
              console.log('Error 403');
              this.AuthService.onLogout().subscribe();
              return throwError(() => new Error(error.error));
            }
            return throwError(() => new Error(error.error));
          })
        );
      }),
      catchError(error => {
        console.error('Error en el proceso de obtención del token o en la petición HTTP', error);
        return throwError(() => error);
      })
    );
  }

  public updateRole(role: any): Observable<any> {
    console.log('role:', role);
    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          return of(false); // Manejo adecuado de la ausencia de token
        }
        // http://localhost:8000/admin/update-role
        const url = `${this.baseUrl}/admin/update-role`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.http.put<RoleRegirter>(url, role, { headers }).pipe(
          delay(3000), // Simular demora (si es necesario)
          map(resp => {
            console.log('service role response:', resp);
            return resp
          }),
          catchError(error => {
            console.log('service role error:', error);
            if (error.status === 0) {
              console.log('Error 0');
              return throwError(() => new Error('Error en el servidor'));
            }
            if (error.status === 403) {
              console.log('Error 403');
              this.AuthService.onLogout().subscribe();
              return throwError(() => new Error(error.error));
            }
            return throwError(() => new Error(error.error));
          })
        );
      }),
      catchError(error => {
        console.error('Error en el proceso de obtención del token o en la petición HTTP', error);
        return throwError(() => error);
      })
    );
  }

}
