import { AbstractControl, ValidatorFn } from '@angular/forms';

// Función de validador que verifica si el campo contiene la palabra "marca no asignada"
export function forbiddenMunicipioValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = /marca\s+no\s+asignada/i.test(control.value);
    return forbidden ? { forbiddenMunicipio: { value: control.value } } : null;
  };
}
