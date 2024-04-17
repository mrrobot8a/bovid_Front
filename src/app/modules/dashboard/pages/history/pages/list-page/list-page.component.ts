import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { HistoryService } from '../../service/history.service';
import { Historial } from '../../interfaces/history.interface';
import { Subscription, mapTo } from 'rxjs';
import { mapToHistorialModelTable } from '../../helper/mapers/historyTohistoryModelTable';


@Component({
  selector: 'app-list-page-history',
  templateUrl: './list-history-page.component.html',
  styles: ``,
})
export class ListHistoryPageComponent implements OnInit, OnDestroy {

  private historyService = inject(HistoryService);
  private subscription: Subscription = new Subscription();
  private _data = signal<any | null>(null);

  public isLoading =  true;

  constructor() { }

  ngOnInit(): void {
    this.loadHistoryData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Desuscribirse al destruir el componente
  }

  // Considera iniciar pageIndex y pageSize con valores por defecto si es necesario
  private pageIndex: number = 0;
  pageSize: number = 30;
  totalPages: number = 0;
  showColumnActions = false;
  title = 'Historial de usuarios';

  public getDataHistory = computed(() => this._data());


  onPageChange(event: { pageIndex: number, pageSize: number, lastPage: number, totalPages: number }) {
    // Actualizar pageIndex y pageSize con los nuevos valores
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.totalPages = event.totalPages;
    console.log('isLastPage:', event.lastPage)
    console.log('pageIndex:', this.pageIndex);
    console.log('pageSize:', this.pageSize);
    // Cargar los datos correspondientes a la nueva página y tamaño de página
    if ((event.totalPages - 1) == this.pageIndex) {
      this.isLoading = true;
      console.log('isLastPage:', this.totalPages)
      this.loadHistoryData({ pageIndex: event.totalPages - 1, pageSize: 30 });
    }

  }

  private loadHistoryData(options: { pageIndex: number, pageSize: number }): void {
    console.log('size:', options.pageSize);

    this.subscription.add(
      this.historyService.getAllHistory(options.pageIndex, options.pageSize).subscribe({
        next: (response) => {
          console.log('Data mapeada:', mapToHistorialModelTable(response.historial.content)); // Asegúrate de corregir la ortografía si fue un error
          this._data.set(mapToHistorialModelTable(response.historial.content));
          this.isLoading = false;
          console.log('Data received ListHistory:', this._data());

        },
        error: (error) => {
          console.error('Error fetching history:', error);
          this.isLoading = false;
        }
      }));
  }





}
