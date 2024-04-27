import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/components/alerts/alert.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { sign } from 'crypto';


@Component({
  selector: 'app-changed-password',

  templateUrl: './changedPassword.component.html',
  styleUrl: './changedPassword.component.css',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangedPasswordComponent implements OnInit {

  ngOnInit(): void {
    // Obtener el valor del token de la URL
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('Token:', this.token);
  }

  constructor(private route: ActivatedRoute, private router: Router) { }

  hide = true;

  isLoading = signal<boolean>(false);
  token: any;

  private alert = inject(AlertService);
  //la clase formbuider nos permite crear formularios reactivos
  private fb = inject(FormBuilder);
  //esto es como hacer un new de clase AuthService
  private authService = inject(AuthService);

  //creamos un formulario reactivo
  public loginForm: FormGroup = this.fb.group<any>({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validator: this.MatchFieldsValidator('password', 'confirmPassword'),
  } as AbstractControl);





  private MatchFieldsValidator(field1: string, field2: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const field1Value = control.get(field1)?.value;
      const field2Value = control.get(field2)?.value;

      if (field1Value !== field2Value) {
        return { mismatchedFields: true };
      }

      return null;
    };
  }


  public changePassword() {

    const { email, password: newPassword, confirmPassword } = this.loginForm.value;
    console.log(this.loginForm.value);
    console.log(email, newPassword, confirmPassword)


    this.isLoading.set(true);
    this.authService.changePassword(email, newPassword, confirmPassword, this.token).subscribe({
      next: (resp) => {
        console.log(resp);
        this.isLoading.set(false);
        this.alert.alertNotificationProgress({
          title: 'Success',
          icon: 'success',
          message: 'Solicitud cambio de contraseña realizado',
          position: 'top',
          color: 'green',
        });

        setTimeout(() => {
          this.router.navigateByUrl('auth/login');
        }, 3000);

      },
      error: (error) => {
        console.log({ changePasswordError: error });
        this.isLoading.set(false);
        this.alert.alertNotificationProgress({
          title: 'Error',
          icon: 'error',
          message: error,
          duration: 5000,
        });
      },
    });
  }


}


