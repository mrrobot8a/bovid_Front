import { Injectable, computed, PLATFORM_ID, inject, signal, Inject, AfterViewInit } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, delay, map, of, tap, throwError } from "rxjs";
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from "../interfaces";
import { error } from "node:console";
import { isPlatformBrowser } from '@angular/common';
import { environment } from "../../../../environments/enviroments";
import { decodeToken, mapTokenToUser, hasTokenExpired } from '../helper/decode-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AfterViewInit {

  // readonly para evitar que se modifique el valor de la variable en tiempo de ejecución
  // exponemos la base url para que sea accesible desde cualquier componente
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  // signal es una variable reactiva que nos permite emitir valores a los componentes que estén suscritos a ella
  private _currrentUser = signal<User | null>(null);
  // el estado de la autenticacoin es un observable que nos permite saber si el usuario esta autenticado o no
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);


  // computed es una función que nos permite obtener el valor de una variable reactiva
  public currentUser = computed(() => this._currrentUser());
  public authStatus = computed(() => this._authStatus());

  private readonly platformId = inject(PLATFORM_ID);


  constructor(


  ) {
    this.checkAuthentication().subscribe();

  }

  ngAfterViewInit() {
    this.runOnClient()

  }

  public checkAuthentication(): Observable<boolean> {

    const token = this.runOnClient();
    const tokenDecoded = hasTokenExpired(token!);

    if (token == null) {
      console.log('actulizar set checkAuthstatus')
      this._setAuthentication(null, '', AuthStatus.notAuthenticated);
      console.log('checking:service: ', this._authStatus());
      return of(false);
    }

    if (!tokenDecoded) {
      return of(true).pipe(
        delay(3000), // Retrasa la emisión por 3000 ms
        tap(() => {
          console.log('token no ha expirado');
          const user: User | null = mapTokenToUser(token!);
          console.log('user', user);
          this._setAuthentication(user, token!, AuthStatus.authenticated);
        }),
      );
    }

    const url = `${this.baseUrl}/auth/refresh-token`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Corregir el uso de template literals
    });

    const result = this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      delay(3000),
      map(({ user, token }) => {
        console.log(this._authStatus())
        return this._setAuthentication(user, token, AuthStatus.authenticated);
      }),
      catchError((error) => {
        if (error.status === 0) {
          this._setAuthentication(null, '', AuthStatus.notAuthenticated);
          console.log('checking:service: ', this._authStatus);
          this._authStatus.set(AuthStatus.notAuthenticated);
          return throwError(() => 'No se pudo conectar al servidor. Por favor, intenta de nuevo más tarde.');
        };
        this._setAuthentication(null, '', AuthStatus.notAuthenticated);
        return of(false)
      }),
    );

    return result;

  }


  public login(email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/sign-in`;
    const body = { email, password };
    //loginresponse es el  modelo que nos devuelve el servidor json
    //pipe nos permite encadenar operadores de rxjs
    const result = this.http.post<LoginResponse>(url, body).pipe(
      delay(3000),
      tap((resp) => console.log(resp.message, 'resp')),
      map(({ user, token }) => {
        return this._setAuthentication(user, token, AuthStatus.authenticated);
      }),
      //nos permite capturar el error que nos devuelve la peticion http
      catchError((error: LoginResponse | any) => {
        console.log(error, 'error')
        if (error.status === 0) {
          return throwError(() => 'No se pudo conectar al servidor. Por favor, intenta de nuevo más tarde.');
        }
        if(error.status === 401){
          return throwError(() => 'Usuario o contraseña incorrectos');
        }
        const { success, error: errorMessage } = error.error;
        console.log(errorMessage, 'error')

        return throwError(() => errorMessage);
      }),
    );

    return result;

  }

  public onLogout(): Observable<any> {
    const token = this.runOnClient();
    console.log(token, 'token');
    if (!token) return of({ 'success': false });

    const url = `${this.baseUrl}/auth/sign-out`;

    // Configurando correctamente los encabezados HTTP.
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Corregir el uso de template literals
    })

    // Asegúrate de pasar los encabezados como parte de las opciones en el tercer argumento de la llamada POST.
    const result = this.http.post<LoginResponse>(url, {}, { headers }).pipe(
      tap(({ message, error }) => {
         console.log('logout', message, error);
        this._setAuthentication(null, '', AuthStatus.notAuthenticated);
      }),
      map(resp => resp),
      catchError((error: LoginResponse | any) => {
        if (error.status === 0) {
          return throwError(() => 'No se pudo conectar al servidor. Por favor, intenta de nuevo más tarde.');
        }
        const { success, error: errorMessage } = error.error;
        console.log(errorMessage, 'error-logoud')
        this._setAuthentication(null, '', AuthStatus.notAuthenticated);
        return throwError(() => errorMessage);
      })
    );

    return result;
  }




  private runOnClient(): string | null {
    let token = null;
    try {
      if (isPlatformBrowser(this.platformId) && localStorage !== undefined) {
        // Estamos en el lado del cliente
        token = localStorage.getItem('token');
      } else if (typeof sessionStorage !== 'undefined' && sessionStorage !== null) {
        token = sessionStorage.getItem('token');
      } else {
        // No estamos en el lado del cliente (SSR u otro entorno donde localStorage no está disponible)
        console.log('localStorage no está disponible en este entorno.', this.platformId);

      }
    } catch (error) {
      console.error('Error al acceder a localStorage:', error);
    }
    return token;
  }


  private _setAuthentication(user: User | null, token?: string, authStatus?: AuthStatus): boolean {
    console.log(authStatus, 'service');
    this._currrentUser.set(user);
    this._authStatus.set(authStatus!);

    if (token !== undefined && user !== null) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    return true;
  }



}

