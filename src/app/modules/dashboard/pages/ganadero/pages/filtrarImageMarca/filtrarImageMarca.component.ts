import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { GanaderoService } from '../../service/ganadero.service';
import { AlertFilterComponent } from '../../components/AlertFilter/AlertFilter.component';
import Swal from 'sweetalert2';
import { catchError, forkJoin, map, switchMap, throwError } from 'rxjs';
import { GanaderoResponseFilter } from '../../interface/ganaderoResponseFilter';
import { sign } from 'crypto';
import { GanaderoResultante, mapGanaderosToGanaderosResultantes } from '../../helper/mappers/ganaderoApiToModelTablaFilter';
import { encontrarUrlFileMayorSimilitud } from '../../helper/obtenerMarcaConMaoyorSolicitud';

@Component({
  selector: 'app-filtrar-image-marca',
  standalone: false,
  templateUrl: './filtrarImageMarca.component.html',
  styleUrl: './filtrarImageMarca.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltrarImageMarcaComponent {





  // Señal para almacenar los datos de los usuarios y obtener
  private _data = signal<any | null>(null);
  public getData = computed(() => this._data());
  // Señal para almacenar el estado de la petición de guardar un nuevo usuario
  private _statusData = signal<boolean>(true);
  public isPosting = computed(() => this._statusData());


  image: File | null = null;
  private _showModalLoading = signal<boolean>(false);
  public showModalLoading = computed(() => this._showModalLoading());

  public NumbersResultados = 0;



  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  showColumnActions: boolean = false;
  goBack() {
    throw new Error('Method not implemented.');
  }


  @ViewChild('imagePreview') imagePreview!: ElementRef;
  fileToUpload: File | null = null;

  constructor(private ganaderService: GanaderoService) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileToUpload = file;

    // Para mostrar una vista previa de la imagen seleccionada
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      // Actualiza el atributo src de la imagen directamente
      this.imagePreview.nativeElement.src = reader.result;
      this.imagePreview.nativeElement.style.display = 'block';
      this.imagePreview.nativeElement.style.width = '100%';
      this.imagePreview.nativeElement.style.height = '100%';
      this.imagePreview.nativeElement.style.objectFit = 'contain';
    };
  }

  onSubmited() {
    console.log('onSubmited');

    this._showModalLoading.set(true);


    // Aquí puedes enviar el archivo a un servidor
    // Por ejemplo, usando el servicio HttpClient de Angular

    if (this.fileToUpload) {
      console.log('fileToUpload:', this.fileToUpload);
      const formData = new FormData();
      formData.append('image', this.fileToUpload);

      // Dentro de tu método onSubmited
      this.ganaderService.filtrarImagen(formData).pipe(
        switchMap((response: GanaderoResponseFilter) => {
          console.log('response:', response);
          console.log('nameFile:', response.ganadero[0].marcasGanadera[0].urlImage.split('/').pop());
          const urlFile: string | null = encontrarUrlFileMayorSimilitud(response);

          // Realizar la segunda petición HTTP aquí
          // Supongamos que necesitas hacer una petición llamada segundaPeticion() del servicio ganaderService
          return this.ganaderService.getImageFile(urlFile?.split('/').pop()!).pipe(

            map(segundaRespuesta => (
              console.log('response:', response),
              console.log('segundaRespuesta:', segundaRespuesta),
              {
                primeraPeticion: response,
                segundaPeticion: segundaRespuesta
              })),
            catchError(error => {
              // Manejar el error de la segunda petición
              console.error('Error en la segunda petición:', error);
              this._showModalLoading.set(false);
              // Puedes lanzar un nuevo error para que sea manejado en el bloque error de la suscripción principal
              return throwError(() => new Error('Error en la segunda petición'));
            })

          );
        })
      ).subscribe({
        next: (result: any) => {

          // Si el contenido es una imagen PNG, muestra la imagen en una etiqueta <img>
          const blob = new Blob([result.segundaPeticion], { type: 'image/png' });
          const url = window.URL.createObjectURL(blob);
          const imgElement = document.getElementById('imagenResultado') as HTMLImageElement;
          imgElement.src = url;

          this.NumbersResultados = result.primeraPeticion.ganadero.length;
          console.log('similitud mayor', encontrarUrlFileMayorSimilitud(result.primeraPeticion));
          console.log('mapRsultadoGanadero', mapGanaderosToGanaderosResultantes(result.primeraPeticion.ganadero));
          this._data.set(mapGanaderosToGanaderosResultantes(result.primeraPeticion.ganadero));
          this._showModalLoading.set(false);
          // Manejar las respuestas de ambas peticiones
          console.log('Respuesta de la primera petición:', result.primeraPeticion);
          console.log('Respuesta de la segunda petición:', result.segundaPeticion);
        },
        error: (error) => {
          console.error('Error en alguna de las peticiones:', error);
          this._showModalLoading.set(false);
          // Manejo del error, por ejemplo, mostrar un mensaje de error al usuario
        }
      });

    }

  }




  editar($event: GanaderoResultante) {
    console.log('editar', $event);
    const { urlImage } = $event;

    Swal.fire({
      title: 'Cargando Imagen',
      html: 'Por favor, espere un momento',
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });


    this.ganaderService.getImageFile(urlImage!.split('/').pop()!).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'image/png' });
        const url = window.URL.createObjectURL(blob);
        Swal.update({
          text: 'Marca Ganadera',
          html: '',
          title: '',
          imageUrl: url,
          imageWidth: 400,
          imageHeight: 330,
          showCloseButton: true,

        });
        Swal.hideLoading();
      },
      error: (error) => {

      }
    });
    // const parament = urlImage?.split('/').pop();
    // const nuevaPestana = window.open(`/dashboard/ganadero/viewFile?nameFile=${parament}`, '_blank');
    // nuevaPestana!.focus();

  }



};
