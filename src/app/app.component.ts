import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { AuthStatus } from './modules/auth/interfaces';
import { AuthService } from './modules/auth/services/auth.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  token?: string;

  constructor(private route: ActivatedRoute) {
    console.log('4')

    console.log('ruta actual', this.router.url)
    this.router.events.subscribe(
      {
        next: (event) => {
          if (event instanceof NavigationStart && event.url.includes('change-password')) {
            console.log('ruta actual:', event.url);
            this.isChamgePassword.set(true);

          }

        },
        complete: () => {

        }
      }
    );

  }

  ngOnInit(): void {

    console.log('5')

  }


  title = 'Bovid';
  private authService = inject(AuthService);
  private router = inject(Router);
  private isChamgePassword = signal<boolean>(false);



  public finishedAuthCheck = computed<boolean>(() => {

    console.log('2')
    if (this.isChamgePassword()) {
      return true;
    }

    console.log(this.authService.authStatus())
    if (this.authService.authStatus() === AuthStatus.checking) {
      console.log('authStatus:', this.authService.authStatus())
      return false;
    }


    console.log(this.authService.authStatus())
    return true;

  });



  public authStatusChangedEffect = effect(() => {
    console.log('authStatus appcomponent:', this.authService.authStatus());
    console.log('1 appcomponent')
    switch (this.authService.authStatus()) {
      case AuthStatus.authenticated:
        if (this.router.url.includes('change-password')) {
          return;
        }
        const returnUrl  = localStorage.getItem('returnUrl');
        console.log('returnUrl:', returnUrl);
        if (!returnUrl ) {
          console.log('entro', returnUrl)
          this.router.navigateByUrl('/dashboard');
          return;
        }
        // localStorage.removeItem('returnUrl');
        this.router.navigateByUrl(returnUrl!);
        return;
      case AuthStatus.notAuthenticated:
        if (this.router.url.includes('change-password')) {
          return;
        }
        localStorage.removeItem('returnUrl')
        this.router.navigateByUrl('/auth/login');
        return;

    }
  });

}
