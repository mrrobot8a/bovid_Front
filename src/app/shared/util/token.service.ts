import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getToken(): Observable<string | null> {
    return new Observable(observer => {
      try {
        if (isPlatformBrowser(this.platformId)) {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          observer.next(token);
        } else {
          console.log('No estamos en el lado del cliente');
          observer.next(null);
        }
      } catch (error) {
        console.error('Error al acceder al almacenamiento:', error);
        observer.next(null);
      }
      observer.complete();
    });
  }
}
