import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../../environments/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../auth/services/auth.service';
import { Observable, catchError, delay, map, of, switchMap, throwError } from 'rxjs';
import { TokenService } from '../../../../../shared/util/token.service';
import { UserPegableResponse } from '../interface';
import { error } from 'node:console';
import { UserRegistration } from '../interface/user-register';





@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private readonly baseUrl: string = environment.baseUrl;
  private tokenService = inject(TokenService);
  private AuthService = inject(AuthService);
  private httpClient = inject(HttpClient);



  public getAllUsers(page?: number, size: number = 30): Observable<any> {
    console.log('getAllUsers');
    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          return of(false); // Manejo adecuado de la ausencia de token
        }
        // http://localhost:8000/admin/get-all-users
        const url = `${this.baseUrl}/admin/get-all-users?page=${page}&size=${size}`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.httpClient.get<UserPegableResponse>(url, { headers }).pipe(
          delay(3000), // Simular demora (si es necesario)
          map(resp => {
            console.log('service user response:', resp);
            return resp
          }),
          catchError(error => {
            console.log('service user error:', error);
            if (error.status === 0) {
              console.log('Error 0');
              return throwError(() => new Error('Error en el servidor'));
            }
            if (error.status === 403) {
              console.log('Error 403');
              this.AuthService.onLogout().subscribe();
              return throwError(() => new Error(error.error));
            }

            return throwError(() => error);


          })
        );
      }),
      catchError(error => {
        console.error('Error en el proceso de obtención del token o en la petición HTTP', error);
        return throwError(() => error);
      })
    );



  }

  public saveUser(user: UserRegistration): Observable<any> {
    console.log('save', user);
    return this.tokenService.getToken().pipe(

      switchMap(token => {

        if (token == null) {
          console.log('No existe token en el localStorage');
          return of(false); // Manejo adecuado de la ausencia de token
        }
        //http://localhost:8000/auth/register
        const url = `${this.baseUrl}/auth/register`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.httpClient.post<UserRegistration>(url, user, { headers }).pipe(
          delay(3000), // Simular demora (si es necesario)
          map(resp => {
            console.log('service user response:', resp);
            return resp;
          }),

          catchError(error => {
            console.log('service user error:', error);
            if (error.status === 0) {
              console.log('Error 0');
              return throwError(() => new Error('Error en el servidor'));
            }
            if(error.status === 400){
             return throwError(() => 'EL correo ya se encuentra registrado');
            }
            if (error.status === 403) {
              console.log('Error 403');

              return throwError(() => new Error(error.error));
            }

            return throwError(() => new Error('Error procesando la petición get all user'));
          })
        );
      }),
    );

  }

  public editUser(user: UserRegistration): Observable<any> {
    console.log('edit', user);
    return this.tokenService.getToken().pipe(

      switchMap(token => {

        if (token == null) {
          console.log('No existe token en el localStorage');
          return of(false); // Manejo adecuado de la ausencia de token
        }
        //http://localhost:8000/auth/register
        const url = `${this.baseUrl}/admin/update-user`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.httpClient.put<UserRegistration>(url, user, { headers }).pipe(
          delay(3000), // Simular demora (si es necesario)
          map(resp => {
            console.log('service user response:', resp);
            return resp;
          }),

          catchError(error => {
            console.log('service user error:', error);
            if (error.status === 0) {
              console.log('Error 0');
              return throwError(() => new Error('Error en el servidor'));
            }
            if(error.status === 400){
             return throwError(() => 'EL correo ya se encuentra registrado');
            }
            if (error.status === 403) {
              console.log('Error 403');

              return throwError(() => new Error(error.error));
            }

            return throwError(() => new Error('Error procesando la petición get all user'));
          })
        );
      }),
    );

  }
}
