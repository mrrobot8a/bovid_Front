import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormStatus } from '../../../users/interface/form_status.enum';
import { GanaderoService } from '../../service/ganadero.service';
import { mapToGanaderoModelTable } from '../../helper/mappers/ganaderoToganaderoModelTable';
import { NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-list-ganadero',
  standalone: false,
  templateUrl: './list-ganadero.component.html',
  styleUrl: './list-ganadero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListGanaderoComponent implements OnInit, OnDestroy {
  urlNavigarion: string = '/dashboard/ganadero/add';

  constructor(private ganaderoService: GanaderoService, private router: Router) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Desuscribirse al destruir el componente

  }
  ngOnInit(): void {
    console.log('listGanaderos');
    // Cargar los datos correspondientes a la primera página y tamaño de página
    this.loadGanderoData({ pageIndex: this.pageIndex, pageSize: this.pageSize });

  }

  title: string = 'Lista de ganaderos';
  // subscription para desuscribirse al destruir el componente
  private subscription: Subscription = new Subscription();

  // Señal para almacenar los datos de los usuarios y obtener
  private _data = signal<any | null>(null);
  public getData = computed(() => this._data());
  // Señal para almacenar el estado de la petición de guardar un nuevo usuario
  private _statusData = signal<boolean>(false);
  // estado de los datos de la tabala para saber si esta vacio o no
  public statusData = computed(() => this._statusData());
  // saber si en la vista se esta haciendo una peticion de crear una nueva data
  public isPosting = computed(() => this._statusData());

  private formStatus = signal<FormStatus>(FormStatus.isNoPosting);
  public isStatusSolicitudHttp = computed(() => this.formStatus());

  public isLoading = signal<boolean>(true);

  // Considera iniciar pageIndex y pageSize con valores por defecto si es necesario
  private pageIndex: number = 0;
  pageSize: number = 30;
  totalPages: number = 0;
  showColumnActions = true;


  onPageChange(event: { pageIndex: number, pageSize: number, lastPage: number, totalPages: number }) {
    // Actualizar pageIndex y pageSize con los nuevos valores
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.totalPages = event.totalPages;
    console.log('isLastPage:', event.lastPage)
    console.log('pageIndex:', this.pageIndex);
    console.log('pageSize:', this.pageSize);
    // // Cargar los datos correspondientes a la nueva página y tamaño de página
    if ((event.totalPages - 1) == this.pageIndex) {
      console.log('isLastPage:', this.totalPages)
      this.loadGanderoData({ pageIndex: event.totalPages - 1, pageSize: 30 });
    }

  }

  private loadGanderoData(options: { pageIndex: number, pageSize: number }): void {
    console.log('size:', options.pageSize);
    this.isLoading.set(true);
    try {


      this.subscription.add(
        this.ganaderoService.getAllGanaderos(options.pageIndex, options.pageSize).subscribe({
          next: (response) => {

            // Asegúrate de corregir la ortografía si fue un error
            // this._data.set(mapToUserModelTable(response.Users.content));
            console.log('Data received ListUser:', response.ganadero.content);
            // this._data.set(mapToUserModelTable(response.Users.content));
            console.log('Data received ListUser:', mapToGanaderoModelTable(response.ganadero.content));
            this._data.set(mapToGanaderoModelTable(response.ganadero.content));
            this.isLoading.set(false);
          },
          error: (error) => {
            console.log('Error fetching history:', error);
            this.isLoading.set(false);
          }
        }));
    } catch (error) {
      console.log('Error fetching ganadero view component:', error);
      this.isLoading.set(false);
    }
  }


  onEditar(event: any) {
    console.log('Editar Ganadero:', event);
    // Crear un objeto con los parámetros que deseas pasar a la ruta de edición
    const parametros: NavigationExtras = {
      state: {
        ganadero: event  // Pasar el objeto event como parte del estado de navegación
      }
    };

    this.router.navigate(['/dashboard/ganadero/edit', event.id], parametros);

  }


}
