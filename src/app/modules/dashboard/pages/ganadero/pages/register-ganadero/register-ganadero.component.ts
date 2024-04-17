import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, delay, of, switchMap } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { environment } from '../../../../../../../environments/enviroments';
import { GanaderoService } from '../../service/ganadero.service';
import { mapToContent } from '../../helper/mappers/ganaderoFormDataToGanaderoApiRegister';
import { title } from 'process';


interface CustomSweetAlert {
  title: string;
  text: string;
  icon: string;
  showCancelButton: boolean;
  confirmButtonText: String;
  cancelButtonText: string;
}

@Component({
  selector: 'app-register-ganadero',
  standalone: false,

  templateUrl: './register-ganadero.component.html',
  styleUrl: './register-ganadero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterGanaderoComponent implements OnInit {
  fileName = '';
  fileNameImage = '';
  // Método para manejar la selección de archivo

  // Define un arreglo para almacenar las imágenes cargadas
  public imageList: { url: string, size: string }[] = [];
  private listImageFile: File[] = [];

  buttonClicked = false;

  onButtonClick() {
    this.buttonClicked = true;
  }

  // Método para manejar la selección de archivos de imagen
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const fileSizeMB = (file.size / (1024 * 1024));// Calcula el tamaño en KB
      console.log(fileSizeMB);
      // Añade la URL y el tamaño de la imagen al arreglo de imágenes
      if (fileSizeMB > 0.7) { // Verifica si el tamaño supera los 700 KB
        // Muestra un mensaje de error si el tamaño es mayor a 700 KB
        this.snackbar.open('El tamaño de la imagen no puede superar los 700 MB.', 'Cerrar', {
          duration: 4000,
          verticalPosition: 'top',
        });
        // Limpia el input de archivo
        event.target.value = null;
        return; // Sale del método sin agregar la imagen a la lista
      }
      const size = `${fileSizeMB.toFixed(3)} MB`;

      this.fileNameImage = file.name;
      this.imageList.push({ url, size });
      this.listImageFile.push(file);
    }
  }

  openImageModal(imageUrl: string): void {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: 'Imagen en tamaño completo',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'sweetalert-image-popup'
      }
    });
  }

  // Método para eliminar una imagen de la lista
  removeImage(index: number) {
    this.imageList.splice(index, 1);
  }

  goBack() {
    window.history.back();
  }

  private formData = new FormData();
  private fb = inject(FormBuilder);
  private ganaderoService = inject(GanaderoService);

  private documentFile?: File;

  existeDocumento = false;
  public ganaderoForm = this.fb.group({
    id: [''],
    firstName: ['', Validators.pattern('^[a-zA-Z ]*$')],
    lastName: ['', [Validators.pattern('^[a-zA-Z ]*$'), Validators.required]],
    ubicacion: ['', Validators.pattern('^[a-zA-Z ]*$')],
    zona: ['', [Validators.required, Validators.pattern('^[0-9]*$')],],
    identificacion: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    phone: ['', Validators.minLength(10)],
    municipio: ['', Validators.pattern('^[a-zA-Z ]*$')],
    departamento: ['', Validators.pattern('^[a-zA-Z ]*$')],
    documentFile: ['', Validators.required],
    ListImageFile: ['', Validators.required],
  });


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log('file:', file);
    if (file) {
      if (file.type !== 'application/pdf') {
        // Si el archivo no es un PDF, muestra un mensaje de error
        this.snackbar.open('Solo se permiten archivos PDF.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });
        // Limpia el input de archivo
        event.target.value = null;
      } else {
        // Si es un PDF, guarda el nombre del archivo
        this.fileName = file.name;

        this.documentFile = file;
        // Aquí puedes seguir con el manejo del archivo como lo necesites
      }
    }
  }

  constructor(
    // private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private http: HttpClient,
  ) { }

  // get currentHero(): Hero {
  //   const hero = this.heroForm.value as Hero;
  //   return hero;
  // }

  ngOnInit(): void {

    if (!this.router.url.includes('edit')) return;
    // Recuperar los parámetros pasados a través del estado de navegación
    this.activatedRoute.paramMap.subscribe(params => {
      console.log('params:', params.getAll('id'));
      const ganaderoEditLocalStorage = localStorage.getItem('ganaderoEdit');
      if (window.history.state.ganadero || ganaderoEditLocalStorage) {
        let ganadero = window.history.state.ganadero;

        if (!ganaderoEditLocalStorage) {
          localStorage.setItem('ganaderoEdit', JSON.stringify(ganadero));
        }

        this.ganaderoForm.reset(ganadero ? ganadero : JSON.parse(ganaderoEditLocalStorage!));
        console.log('Objeto Ganadero:', ganadero);
        console.log('ganadero:', this.router.getCurrentNavigation()?.extras.state?.['ganadero']);
        // Aquí puedes usar el objeto ganadero según tus necesidades en la vista de edición
      }
    });
  }

  get currentGanadero(): any {
    const id = this.ganaderoForm.value.id;
    return id;
  }



  onSubmit(): void {

    if ((this.documentFile === null || this.documentFile === undefined) && this.ganaderoForm.value.id === null) {
      this.existeDocumento = true;

      this.snackbar.open('Por favor, adjunte un archivos requeridos', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    if (this.ganaderoForm.value.id) {
      const formData = new FormData();
      formData.delete('images');
      formData.delete('fileDocument');
      formData.delete('ganadero');
      const ganaderoApi = mapToContent(JSON.stringify(this.ganaderoForm.value));
      formData.append('ganadero', JSON.stringify(ganaderoApi));
      formData.append('fileDocument', this.documentFile!);
      formData.append('images', this.listImageFile[0]);

      console.log('Editar Ganadero:', formData.getAll('ganadero'));
      console.log('Editar Ganadero:', formData.getAll('fileDocument'));
      console.log('Editar Ganadero:', formData.getAll('images'));

      this.ganaderoService.updateGanadero(formData).subscribe({
        next: (resp) => {
          console.log(resp);
          this.showSnackbar('Ganadero actualizado con éxito');
          this.router.navigate(['/dashboard/ganadero']);
        },
        error: (error: any) => {
          console.log({ error });
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar la solicitud',
            text: 'Por favor, intente de nuevo',
            timer: 3000,
            showCloseButton: true,
          });
        }
      });

      console.log('Editar Ganadero:', this.ganaderoForm.value);
      return;
    } else {
      const formData = new FormData();
      formData.delete('images');
      formData.delete('fileDocument');
      formData.delete('ganadero');
      const ganaderoApi = mapToContent(JSON.stringify(this.ganaderoForm.value));

      this.listImageFile.forEach(image => {
        formData.append('images', image, image.name);
      });

      formData.append('fileDocument', this.documentFile!);
      formData.append('ganadero', JSON.stringify(ganaderoApi));


      this.saveData(formData);
      return;
    }
  }

  private saveData(formData: FormData) {
    this.showConfirmDialog({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning', confirmButtonText: 'Enviar Solicitud',
      showCancelButton: true, cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result) {
        this.showGuardando();
        this.ganaderoService.createGanadero(formData).subscribe({
          next: (resp) => {
            console.log(resp);
            this.showConfirmDialog({
              title: 'Solicitud enviada con éxito',
              text: '¿Deseas agregar otro Registro?',
              icon: 'success', confirmButtonText: 'Enviar Solicitud',
              showCancelButton: true, cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result) {
                this.ganaderoForm.reset();
                this.imageList = [];
                this.fileName = '';
                this.fileNameImage = '';

              } else {
                this.router.navigate(['/dashboard/ganadero']);
              }
            });
          },
          error: (error: any) => {
            console.log({ error });
            Swal.fire({
              icon: 'error',
              title: 'Error al enviar la solicitud',
              text: 'Por favor, intente de nuevo',
              timer: 3000,
              showCloseButton: true,
            });
          }
        });
      }
    });
  }


  onDeleteHero() {
  }


  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    })
  }

  async showConfirmDialog(option: CustomSweetAlert): Promise<boolean> {
    try {
      const result = await Swal.fire({
        title: option.title,
        text: option.text,
        icon: option.icon as SweetAlertIcon, // Fix: Cast option.icon to SweetAlertIcon
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false
      });

      return result.isConfirmed;
    } catch (error) {
      throw error;
    }
  }


  showGuardando(): void {
    Swal.fire({
      title: 'Guardando',
      html: 'Por favor, espere un momento',
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }
}
