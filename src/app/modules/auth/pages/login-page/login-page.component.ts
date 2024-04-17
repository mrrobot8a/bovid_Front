import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoginResponse } from '../../interfaces/login-response.interface';
import { AlertService } from '../../../../shared/components/alerts/alert.service';
import { AuthService } from '../../services/auth.service';
import { sign } from 'crypto';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [

  ],
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent {

  constructor(private router: Router) { }

  hide = true;
  isLoading = false;

  private alert = inject(AlertService);
  //la clase formbuider nos permite crear formularios reactivos
  private fb = inject(FormBuilder);
  //esto es como hacer un new de clase AuthService
  private authService = inject(AuthService);

  //creamos un formulario reactivo
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]],
  });


  login() {
    //desestructuramos el objeto para obtener el email y el password
    const { email, password } = this.loginForm.value;
    this.isLoading=true;
    //llamamos al metodo login del servicio AuthService
    this.authService.login(email, password).subscribe({
      next: (resp) => {
        console.log(resp);
        this.isLoading=false;
        // this.router.navigateByUrl('dashboard/users');

      },
      //capturamos el error que nos devuelve el observable throwError
      error: (error: LoginResponse | any) => {
        console.log({ loginError: error });
        this.isLoading=false;
        this.alert.alertNotificationProgress({
          title: "Error", icon: 'error', message: error, duration: 5000
          , position: 'top-end'
        });
      }


    });



    console.log(this.loginForm.value);
    console.log(this.loginForm.invalid);
  }



  // checkAuthentication(): Observable<boolean> {


  //   if (!localStorage.getItem('token')) {
  //     return of(false);
  //   } else {

  //   }
  // }



}
