import { Component, computed, effect, inject } from '@angular/core';
import { AuthStatus } from './modules/auth/interfaces';
import { AuthService } from './modules/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'heroesApp';
  private authService = inject( AuthService );
  private router = inject( Router );

  public finishedAuthCheck = computed<boolean>( () => {

    console.log(this.authService.authStatus() )
    if ( this.authService.authStatus() === AuthStatus.checking ) {
      console.log( 'authStatus:',this.authService.authStatus() )
      return false;
    }
    console.log(this.authService.authStatus() )
    return true;
  });



  public authStatusChangedEffect = effect(() => {
    console.log('authStatus appcomponent:',this.authService.authStatus());
    switch(this.authService.authStatus()) {
      case AuthStatus.authenticated:
        const returnUrl = localStorage.getItem('returnUrl') || '/dashboard';
        console.log('returnUrl:',returnUrl);

        localStorage.removeItem('returnUrl');
        this.router.navigateByUrl(returnUrl);
        return;
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;

    }
  });

}
