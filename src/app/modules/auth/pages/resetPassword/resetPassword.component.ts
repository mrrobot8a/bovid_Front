import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AlertService } from '../../../../shared/components/alerts/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',

  templateUrl: './resetPassword.component.html',
  styleUrl: './resetPassword.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  login() {
    throw new Error('Method not implemented.');
  }

  hide = true;
  isLoading = signal<boolean>(false);

  private alert = inject(AlertService);
  //la clase formbuider nos permite crear formularios reactivos
  private fb = inject(FormBuilder);
  //esto es como hacer un new de clase AuthService
  private authService = inject(AuthService);


  //creamos un formulario reactivo
  public loginForm: FormGroup = this.fb.group<any>({
    email: ['', [Validators.required, Validators.email]],
  });

  submit() {
    //desestructuramos el objeto para obtener el email y el password
    const { email } = this.loginForm.value;
    this.isLoading.set(true);
    //llamamos al metodo login del servicio AuthService
    this.authService.resetPassword(email).subscribe({
      next: (resp) => {
        console.log(resp.message);
        this.isLoading.set(false);
        this.alert.alertNotificationProgress({
          title: "Success",
          icon: 'success',
          message: resp.message,
          position: 'top',
          color: 'green'
        });

        setTimeout(() => {
          window.history.back();
         },3000);

      },
      //capturamos el error que nos devuelve el observable throwError
      error: (error) => {
        console.log({ loginError: error });
        this.isLoading.set(false);
        this.alert.alertNotificationProgress({
          title: "Error", icon: 'error', message: error, duration: 5000,
          position: 'top'
        });
      }

    });
  }


}
