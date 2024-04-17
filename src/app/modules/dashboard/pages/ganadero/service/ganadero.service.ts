import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../../environments/enviroments';
import { TokenService } from '../../../../../shared/util/token.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, map, of, switchMap, throwError } from 'rxjs';
import { UserPegableResponse } from '../../users/interface';
import { GanaderoResponsePageble } from '../interface/ganaderoResponsePage';
import { GanaderoResponseFilter } from '../interface/ganaderoResponseFilter';

@Injectable({
  providedIn: 'root'
})
export class GanaderoService {
  public updateGanadero(formData: FormData): Observable<any> {
    console.log('formData:', formData.getAll('ganadero'));
    console.log('formData:', formData.getAll('fileDocument'));
    console.log('formData:', formData.getAll('images'));

    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          this.AuthService.onLogout().subscribe();
          return of(false); // Manejo adecuado de la ausencia de token
        }
        // http://localhost:8000/admin/get-all-users
        const url = `${this.baseUrl}/admin/ganadero/update-ganadero`;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.httpClient.put<GanaderoResponsePageble>(url, formData, { headers }).pipe(
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
              // this.AuthService.onLogout().subscribe();
              return throwError(() => new Error(error.error));
            }
            return throwError(() => new Error(error.error));
          })
        );
      })
    )
  }


  constructor(private httpClient: HttpClient) { }

  private readonly baseUrl: string = environment.baseUrl;
  private tokenService = inject(TokenService);
  private AuthService = inject(AuthService);

  public getAllGanaderos(page?: number, size: number = 30): Observable<any> {
    console.log('getAllGanaderos');
    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          return of(false); // Manejo adecuado de la ausencia de token
        }
        // http://localhost:8000/admin/get-all-users
        const url = `${this.baseUrl}/admin/ganadero/get-all-ganaderos?page=${page}&size=${size}`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.httpClient.get<GanaderoResponsePageble>(url, { headers }).pipe(
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
            return throwError(() => new Error(error.error));
          })
        );
      })
    );

  }

  public createGanadero(formData: FormData): Observable<any> {

    console.log('formData:', formData.getAll('ganadero'));
    console.log('formData:', formData.getAll('fileDocument'));
    console.log('formData:', formData.getAll('images'));

    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          this.AuthService.onLogout().subscribe();
          return of(false); // Manejo adecuado de la ausencia de token
        }
        // http://localhost:8000/admin/get-all-users
        const url = `${this.baseUrl}/admin/ganadero/save-ganadero`;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.httpClient.post<GanaderoResponsePageble>(url, formData, { headers }).pipe(
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
              // this.AuthService.onLogout().subscribe();
              return throwError(() => new Error(error.error));
            }
            return throwError(() => new Error(error.error));
          })
        );
      })
    )

  }


  public getImageFile(name: string): Observable<any> {

    console.log('name:', name);

    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          this.AuthService.onLogout().subscribe();
          return of(false); // Manejo adecuado de la ausencia de token
        }
        // http://localhost:8000/admin/support-document/ver-pdf/fae65_ACOSTA DURAN YIMI GREGORIO.png
        const url = `${this.baseUrl}/admin/support-document/ver-pdf/${name}`;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.httpClient.get(url, {
          headers,
          responseType: 'blob'
        }).pipe(
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
              // this.AuthService.onLogout().subscribe();
              return throwError(() => new Error(error.error));
            }
            return throwError(() => new Error(error.error));
          })
        );
      })
    )
  }

  public filtrarImagen(formData: FormData): Observable<any> {


    console.log('formData:', formData.getAll('image'));

    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          this.AuthService.onLogout().subscribe();
          return of(false); // Manejo adecuado de la ausencia de token
        }
        // http://localhost:8000/auth/test
        const url = `${this.baseUrl}/auth/test`;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.httpClient.post<GanaderoResponseFilter>(url, formData, { headers }).pipe(
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
              // this.AuthService.onLogout().subscribe();
              return throwError(() => new Error(error.error));
            }
            return throwError(() => new Error(error.error));
          })
        );
      })
    )
  }
}
