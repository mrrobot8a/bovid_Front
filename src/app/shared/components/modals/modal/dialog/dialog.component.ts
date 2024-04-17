import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material/material.module';
import Swal from 'sweetalert2';


export interface DialogData {
  campos?: {
    [key: string]: {
      title?: string;
      tipo: string; // 'input' o 'select'
      valor?: boolean; // checkbox valor
      validaciones?: any[];
      opciones?: { valor: string; vista: string }[]; // Solo para selects
    }
  };
  configuracionDelFormulario?: { [key: string]: any[] }; // Configuración directa para FormGroup
  shouldClose?: boolean;
  datosActuales?: { [key: string]: any };
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class DialogComponent implements OnInit {

  public form: FormGroup;
  formStatus = true;
  shouldHideField: boolean = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = this.fb.group({});
  }





  // Este objeto almacenará los valores de los campos
  formValues = {};
  hide = true;
  // Método auxiliar para obtener las claves de un objeto, lo utilizaremos en la plantilla HTML
  objectKeys = Object.keys;

  ngOnInit(): void {
    // Primero, verifica si existe configuración del formulario para construirlo
    if (this.data.configuracionDelFormulario) {
      // Construye el formulario con la configuración proporcionada
      this.form = this.fb.group(this.data.configuracionDelFormulario);
    }

    console.log('data', this.data.datosActuales);
    console.log('data', Object.keys(this.data.datosActuales!));

    // Después de asegurar que el formulario esté construido, establece los valores iniciales si se están editando datos existentes
    if (this.data.datosActuales && Object.keys(this.data.datosActuales).length > 0) {
      Object.keys(this.data.datosActuales).forEach(key => {
        if (this.form.controls[key]) {
          this.form.controls[key].setValue(this.data.datosActuales![key]);
        }

      });
    }
  }



  submitForm() {
    //para guardar
    if (this.form.valid && !this.data.datosActuales) {
      this.formStatus = false;
      this.dialogRef.close(this.form.value);
      this.form.reset();
    }
    //para editar
    if (this.form.valid && this.data.datosActuales) {
      Swal.fire({

        title: '<span style="font-size: 24px;">¿Estás seguro de que deseas editar este registro?</span>',
        showDenyButton: true,
        confirmButtonText: `Editar`,
        denyButtonText: `Cancelar`,
        denyButtonColor: "#335AA4",
        confirmButtonColor: "#D73345",
        reverseButtons: true,
        didOpen: () => {

        },

      }).then((result) => {
        if (result.isConfirmed) {
          this.formStatus = false;
          this.dialogRef.close(this.form.value);
          this.form.reset();
        }
      });
    }
  }


}
