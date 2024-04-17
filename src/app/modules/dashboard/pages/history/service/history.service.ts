import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../../../../../environments/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../auth/services/auth.service';
import { Observable, catchError, delay, map, of, switchMap, throwError } from 'rxjs';
import { Historial, } from '../interfaces/history.interface';
import { TokenService } from '../../../../../shared/util/token.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor() {
    console.log('HistoryService');
    // this.AuthService.checkAuthentication().subscribe();

  }

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private AuthService = inject(AuthService);
  private tokenService = inject(TokenService);

 public getAllHistory(page?: number, size: number = 40): Observable<any> {
    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          return of(false); // Manejo adecuado de la ausencia de token
        }

        const url = `${this.baseUrl}/admin/get-all-historys?page=${page}&size=${size}`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<Historial>(url, { headers }).pipe(
          delay(3000), // Simular demora (si es necesario)
          map(resp => resp),
          catchError(error => {
            if (error.status === 403) {
              this.AuthService.onLogout().subscribe();
            }
            return throwError(() => new Error('Error procesando la petición'));
          })
        );
      }),
      catchError(error => {
        console.error('Error en el proceso de obtención del token o en la petición HTTP', error);
        return throwError(() => new Error('Error en el proceso de obtención del token o en la petición HTTP'));
      })
    );
  }



  // private runOnClient(): string | null {
  //   let token = null;
  //   try {
  //     if (isPlatformBrowser(this.platformId) && localStorage !== undefined) {
  //       // Estamos en el lado del cliente
  //       token = localStorage.getItem('token');
  //     } else if (typeof sessionStorage !== 'undefined' && sessionStorage !== null) {
  //       token = sessionStorage.getItem('token');
  //     } else {
  //       // No estamos en el lado del cliente (SSR u otro entorno donde localStorage no está disponible)
  //       console.log('localStorage no está disponible en este entorno.', this.platformId);

  //     }
  //   } catch (error) {
  //     console.error('Error al acceder a localStorage:', error);
  //   }
  //   return token;
  // }

}
