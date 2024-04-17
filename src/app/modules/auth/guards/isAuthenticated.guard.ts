import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  console.log('isAuthenticatedGuard');
  console.log(route,state);
  const auhtService = inject(AuthService);
  const router = inject(Router);
  console.log('authStatus:', auhtService.authStatus());

  if(auhtService.authStatus()=== AuthStatus.authenticated) {
    console.log('ruta actual:', state.url);

    return true;
  }

  if(auhtService.authStatus()=== AuthStatus.checking) {
    localStorage.setItem('returnUrl', state.url);
    return false;
  }



  router.navigateByUrl('/auth/login');
  return false;
};
