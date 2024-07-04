import { Router, type CanActivateFn } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const isNoAuthenticatedGuardTsGuard: CanActivateFn = (route, state) => {

  console.log('isNoAuthenticatedGuard');
  console.log(route,state);
  const authService = inject( AuthService );
  const router = inject( Router );


  if(authService.authStatus()=== AuthStatus.checking) {
    return false;
  }

  if ( authService.authStatus() === AuthStatus.authenticated ) {
    console.log('ruta actual:', router.url);

    // router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
