import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal, computed, inject, signal } from '@angular/core';
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
import { forbiddenMunicipioValidator, } from '../../helper/validator Custom/validatorCustom';
import { ErrorMessages } from '../../interface/ganaderoApiToModelTable';
import { Location } from '@angular/common';


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
export class RegisterGanaderoComponent implements OnInit, OnDestroy {

  fileName = '';
  fileNameImage = '';
  // Señales para manejar el estado de la descarga de archivos PDF
  isProgressActive = signal<boolean>(false);
  isPending = signal<boolean>(false);
  progress = signal<number>(0);
  disableButton = signal<boolean>(false);
  downloading: any = false;

  // Define un arreglo para almacenar las imágenes cargadas
  public imageList: ImageData[] = [];
  private listImageFile: File[] = [];

  //arrreglo que define que marcas a elimnar
  private listMarcasEliminar: { marcaId?: string, isElimnado: boolean }[] = [];
  //variable queindica cuando se esta cargando una imagen
  isLoadingResults = signal<boolean>(true);
  //Variable para obtener la key de un objeto
  Object: any;
  //variables construccion de formulario y validaciones
  private fb = inject(FormBuilder);
  public ganaderoForm = this.fb.group({
    id: [''],
    idMarca: [''],
    identificacion: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5), Validators.maxLength(10)]],
    firstName: ['', Validators.pattern('^[a-zA-Z ]*$')],
    lastName: ['', [Validators.pattern('^[a-zA-Z ]*$'), Validators.required]],
    phone: ['', Validators.minLength(10)],
    ubicacion: ['', [Validators.required, forbiddenMunicipioValidator()]],
    zona: ['', [Validators.required, Validators.pattern('^[0-9]*$'), forbiddenMunicipioValidator()],],
    municipio: ['', [Validators.pattern('^[a-zA-Z ]*$'), forbiddenMunicipioValidator()]],
    departamento: ['', [Validators.pattern('^[a-zA-Z ]*$'), forbiddenMunicipioValidator()]],
    documentFile: ['', Validators.nullValidator],
    imageList: ['', Validators.nullValidator],
  });

  private ganaderoService = inject(GanaderoService);
  //variable me indica que se esta cargando los datos en el modo edit
  loading: boolean = true;
  //variable que indica si existe un documento
  private documentFile?: File;
  existeDocumento = false;

  constructor(
    // private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  ngOnDestroy(): void {
    localStorage.removeItem('ganaderoEdit');
  }


  ngOnInit(): void {


    if (!this.router.url.includes('edit')) return;


    this.activatedRoute.paramMap.subscribe(params => {

      console.log('params:', params.getAll('id'));
      const ganaderoEditLocalStorage = localStorage.getItem('ganaderoEdit');

      if (window.history.state.ganadero || ganaderoEditLocalStorage) {
        let ganadero = window.history.state.ganadero || JSON.parse(ganaderoEditLocalStorage!);
        console.log('ganadero:', ganadero);
        console.log('ganaderoEditLocalStorage:', window.history.state.ganadero);

        if (!ganaderoEditLocalStorage) {
          console.log('Guardando en localStorage', ganadero);
          ganadero.zona = ganadero.zona.toString();
          localStorage.setItem('ganaderoEdit', JSON.stringify(ganadero));
        }

        const ganaderoLocalStorage = JSON.parse(localStorage.getItem('ganaderoEdit')!);
        console.log('ganaderoLocalStorage:', ganaderoLocalStorage.document);

        // Extraer el nombre del archivo del campo `document`
        this.fileName = this.getFileNameFromInput(ganadero ? ganadero.document : ganaderoLocalStorage.document);
        console.log('Nombre del archivo:', this.fileName);

        this.ganaderoForm.reset(ganadero ? ganadero : ganaderoLocalStorage);
        console.log('Objeto Ganadero:', ganaderoEditLocalStorage);
        console.log('ganadero:', this.router.getCurrentNavigation()?.extras.state?.['ganadero']);
        const infoGanadero = ganadero ? ganadero : ganaderoLocalStorage;
        this.onViewFileImage(infoGanadero.urlImage,{ marcaId:infoGanadero.idMarca , ubicacion: infoGanadero.ubicacion, municipio: infoGanadero.municipio, zona: infoGanadero.zona, departamento: infoGanadero.departamento });
        this.ganaderoForm.markAllAsTouched();
        this.ganaderoForm.updateValueAndValidity();
        this.loading = false;
      }
    });




  }

  get currentGanadero(): any {
    const id = this.ganaderoForm.value.id;
    return id;
  }

  onSubmit(): void {
    console.log('documenFile', this.documentFile);
    console.log('listImageFile', this.listImageFile);
    console.log('ganaderoForm:', this.ganaderoForm.value.id);

    if ((this.documentFile === null || this.documentFile === undefined || this.listImageFile.length === 0) && !this.ganaderoForm.value.id) {
      this.existeDocumento = true;

      this.snackbar.open('Por favor, adjunte un archivos requeridos', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    if (this.ganaderoForm.value.id && this.ganaderoForm.valid) {
      const formData = new FormData();
      formData.delete('images');
      formData.delete('fileDocument');
      formData.delete('ganadero');
      const ganaderoValueFrom = this.ganaderoForm.value;
      console.log('ganaderoValueFrom:', ganaderoValueFrom);
      const ganaderoApi = mapToContent(JSON.stringify(this.ganaderoForm.value), this.listMarcasEliminar);
      console.log('ganaderoApi:', ganaderoApi);
      formData.append('ganadero', JSON.stringify(ganaderoApi));
      formData.append('fileDocument', this.documentFile!);
      this.listImageFile.forEach(image => {
        formData.append('images', image, image.name);
      });


      this.showConfirmDialog({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción',
        icon: 'warning', confirmButtonText: 'Enviar Solicitud',
        showCancelButton: true, cancelButtonText: 'Cancelar'
      }).then((result) => {

        if (result) {
          this.showGuardando();
          this.ganaderoService.updateGanadero(formData).subscribe({
            next: (resp) => {
              console.log(resp);
              Swal.close();
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
        }
      });




      return;
    } else if (this.ganaderoForm.valid && !this.ganaderoForm.value.id) {
      const formData = new FormData();

      formData.delete('images');
      formData.delete('fileDocument');
      formData.delete('ganadero');
      const ganaderoApi = mapToContent(JSON.stringify(this.ganaderoForm.value));
      console.log('ganaderoApi:', ganaderoApi);

      this.listImageFile.forEach(image => {
        formData.append('images', image, image.name);
      });

      formData.append('fileDocument', this.documentFile!);
      formData.append('ganadero', JSON.stringify(ganaderoApi));


      this.saveData(formData);
      return;
    }
  }



  // Método para mostrar un mensaje emergente cuadno hay error
  errorMessagess: ErrorMessages = {
    required: 'Dato requerido',
    pattern: 'Solo letras',
    forbiddenMunicipio: 'Digite Datos'
  };
  // Método para obtener los mensajes de error y la key del objeto que contien los mensajes de erorr
  getErrorMessages() {
    const errors = this.ganaderoForm.get('departamento')?.errors;
    if (errors) {
      return Object.keys(errors).map(errorKey => this.errorMessagess[errorKey]);
    }
    return [];
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
                this.listImageFile = [];
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



  // Método para mostrar un mensaje emergente
  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    })
  }
  //modal para seguir guardando (editando) o no datos
  async showConfirmDialog(option: CustomSweetAlert): Promise<boolean> {
    try {
      const result = await Swal.fire({
        title: option.title,
        text: option.text,
        icon: option.icon as SweetAlertIcon, // Fix: Cast option.icon to SweetAlertIcon
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: "#D73345",
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#335AA4",
        allowOutsideClick: false,

      });

      return result.isConfirmed;
    } catch (error) {
      throw error;
    }
  }

  //modal que indica que se esta guardando algun dato
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

  // Método para obtener la imagen de un archivo
  private onViewFileImage(fileName: string, ImageData?: ImageData) {
    console.log('event', fileName);

    console.log('ImageData', ImageData);
    const nameFile = fileName.split('/').pop();
    this.ganaderoForm.get('documentFile')?.disable();
    this.ganaderoForm.get('imageList')?.disable();
    this.ganaderoService.getImageFile(nameFile!).subscribe({
      next: (response) => {
        console.log('response:', response);
        this.isLoadingResults.set(false);
        const url = URL.createObjectURL(response);
        const fileSizeMB = (response.size / (1024 * 1024));// Calcula el tamaño en KB
        console.log(fileSizeMB);
        const size = `${fileSizeMB.toFixed(3)} KB`;
        this.imageList.push({ size,url: url ,...ImageData});
        console.log('imageList:', this.imageList);

      },
      error: (error) => {
        console.log('Error fetching image:', error);
        this.isLoadingResults.set(false);

      }
    });
  }


  showImageData(image: any) {
    console.log('marca', image);
    this.ganaderoForm.patchValue({
      ubicacion: image.ubicacion,
      municipio: image.municipio,
      zona: image.zona,
      departamento: image.departamento,
    });
  }

  // Método para obtener los valores del formulario
  getImageData(imageUrl: string, imageSize: string): ImageData {
    return {
      url: imageUrl,
      size: imageSize,
      ubicacion: this.ganaderoForm.get('ubicacion')!.value!,
      municipio: this.ganaderoForm.get('municipio')!.value!,
      zona: this.ganaderoForm.get('zona')!.value!,
      departamento: this.ganaderoForm.get('departamento')!.value!
    };
  }


  // Método para eliminar una imagen de la lista
  removeImage(index?: number, options?: { blobFile?: any; fileName?: string; marcaId?: string }) {
    const { blobFile, fileName = '', marcaId = '' } = options || {};

    console.log(index, blobFile, 'fileName:', fileName, 'macarcaid:', marcaId);

    if (marcaId) {
      this.listMarcasEliminar.push({ marcaId: marcaId, isElimnado: true });
      console.log('listMarcasEliminar:', this.listMarcasEliminar);
    }


    this.imageList.splice(index!, 1);



  }

  // Método para manejar la selección de archivos PDF
  onFileSelected(event: any): void {
    event.preventDefault();
    const file: File = event.target.files[0];
    console.log('file:', file);
    if (file) {
      if (file.type !== 'application/pdf') {
        this.snackbar.open('Solo se permiten archivos PDF.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });
        event.target.value = null;
      } else {
        this.fileName = this.sanitizeFileName(file.name);
        this.documentFile = file;
      }
    }
  }

  //metodo para descargar un archivo pdf
  downloadPDF() {
    if (this.disableButton()) return;
    // URL del archivo a descargar
    this.ganaderoService.downloadPDF('').subscribe(blob => {
      this.isPending.set(true);
      this.isProgressActive.set(true);
      this.disableButton.set(true);
      if (typeof blob === 'number') {

        console.log('blob:', blob);
        this.progress.set(blob);
      } else {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${this.fileName}`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(downloadUrl);
          document.body.removeChild(link);
          this.progress.set(0);
          this.isProgressActive.set(false);
          this.isPending.set(false);
          this.disableButton.set(false);
        }, 200);



      }
    });
  }
  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  }
  //metodo para obtener el nombre del archivo pdf
  private getFileNameFromInput(inputString: string): string {
    const parts = inputString.split('_');
    console.log('parts:', parts);
    console.log('parts:', parts[1]);
    return ` Nombre Archivo: ${parts[1]}`;
  }

  // Método para manejar la selección de archivos de imagen
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    console.log('file:', file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const fileSizeMB = (file.size / (1024 * 1024));// Calcula el tamaño en KB
      console.log(fileSizeMB);
      // Añade la URL y el tamaño de la imagen al arreglo de imágenes
      if (fileSizeMB > 0.7) { // Verifica si el tamaño supera los 700 KB
        // Muestra un mensaje de error si el tamaño es mayor a 700 KB
        this.snackbar.open('El tamaño de la imagen no puede superar los 700 KB.', 'Cerrar', {
          duration: 4000,
          verticalPosition: 'top',
        });
        // Limpia el input de archivo
        event.target.value = null;
        return; // Sale del método sin agregar la imagen a la lista
      }
      const imageSize = `${fileSizeMB.toFixed(3)} KB`;

      this.fileNameImage = file.name;
      const newImage = this.getImageData(imageUrl, imageSize);

      // Añades la nueva imagen a tu lista imageList
      this.imageList.push(newImage);
      this.listImageFile.push(file);
    }
  }

  //modal q muestra la imagen en tamaño completo
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


  goBack() {
    let returnUrl = "/dashboard/ganadero/edit/3"; // Aquí deberías obtener returnUrl dinámicamente
    let parts = returnUrl.split('/').slice(0, 3);
    let baseRoute = parts.join('/');

    this.router.navigateByUrl(baseRoute);
  }


  // interface ImageData {
  //   url: string;
  //   size: string;
  //   ubicacion: string;
  //   municipio: string;
  //   zona: string;
  //   departamento: string;
  // }

  // const newImage: ImageData = {
  //   url: 'HELLO',
  //   size: 'HELLO',
  //   ubicacion: '', // Aquí debes obtener este dato del formulario correspondiente
  //   municipio: '', // Aquí debes obtener este dato del formulario correspondiente
  //   zona: '', // Aquí debes obtener este dato del formulario correspondiente
  //   departamento: '' // Aquí debes obtener este dato del formulario correspondiente
  // };
  // this.imageList.push(newImage);



}


// Define la interfaz ImageData
interface ImageData {
  url?: string;
  size?: string;
  ubicacion?: string;
  municipio?: string;
  zona?: string;
  departamento?: string;
  marcaId?: string;
}
