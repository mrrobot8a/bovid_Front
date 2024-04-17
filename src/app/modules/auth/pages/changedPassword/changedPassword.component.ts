import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-changed-password',

  templateUrl: './changedPassword.component.html',
  styles: `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ` ,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangedPasswordComponent {


  email = new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/)]);
  password = new FormControl('', Validators.required);
  confirmPassword = new FormControl('', Validators.required);

  getErrorEmailMessage() {
    if (this.email.hasError('required') && this.email.touched) {
      return 'Debes ingresar un valor';
    }
    return this.email.hasError('pattern') ? 'Este correo no contiene el dominio institucional' : '';
  }

  getErrorPasswordMessage() {
    if (this.password.hasError('required') && this.password.touched && this.password.dirty) {
      return 'Debes ingresar la contraseña';
    }
    return '';
  }

  getErrorConfirmPasswordMessage() {
    if (this.confirmPassword.hasError('required') && this.confirmPassword.touched && this.confirmPassword.dirty) {
      return 'Debes confirmar la contraseña';
    }
    if (this.password.value !== this.confirmPassword.value && this.confirmPassword.dirty) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  isFormValid() {
    return this.email.valid && this.password.valid && this.confirmPassword.valid && this.password.value === this.confirmPassword.value;
  }

  onSubmit() {
    if (this.isFormValid()) {
      // Realizar acciones cuando el formulario es válido
    }
  }
}


