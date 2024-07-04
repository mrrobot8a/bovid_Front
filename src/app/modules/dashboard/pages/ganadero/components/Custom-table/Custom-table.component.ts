import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../../../../shared/material/material.module';
import { FormStatus } from '../../../users/interface/form_status.enum';
import { DialogComponent, DialogData } from '../../../../../../shared/components/modals/modal/dialog/dialog.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-custom-table-ganadero',
  standalone: true,
  imports: [
    CommonModule, MaterialModule,
    MatTableModule, MatPaginatorModule, MatSortModule
  ],
  exportAs: 'appCustomTableGanadero',
  templateUrl: './Custom-table.component.html',
  styleUrl: './Custom-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTableGanaderoComponent<T> implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  navigacionFiltre() {
    this.router.navigateByUrl('/dashboard/ganadero/filtrarImageMarca');
  }
  @Input() data: T[] | null = null;
  @Input() columnNames: { [key: string]: string } = {};
  @Input() displayedColumns: string[] = [];
  @Input() showColumnActions = false;
  @Input() title!: string;
  @Input() urlNavigarion!: string;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() camposDinamicos: DialogData | null = null;
  @Input() isPosting: boolean = false;
  @Input() set isStatusSolictud(value: FormStatus) {
    console.log('isStatusSolictud:', value);
    switch (value) {
      case FormStatus.isPosting:
        Swal.fire({
          title: 'Guardando',
          text: 'Por favor, espere...',
          allowOutsideClick: false,
          showConfirmButton: false,
          icon: 'info',
        })
        break;
      case FormStatus.isPostingSuccessfully:
        Swal.fire({
          title: 'Guardado',
          text: 'Guardado con éxito',
          icon: 'success',
          showConfirmButton: true,
          allowOutsideClick: false,
          timer: 2500
        })
        break;
    }

  }

  @Input() set isLoading(value: boolean) {
    this.isLoadingResults = value;
  }

  @Output() editarEvento = new EventEmitter<T>();
  @Output() eliminarEvento = new EventEmitter<T>();
  @Output() pageChange = new EventEmitter<{ pageIndex: number, lastPage: number, pageSize: number, totalPages: number }>();
  @Output() onSave = new EventEmitter<T>();

  dataSource = new MatTableDataSource<T>(this.data ?? []);

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  router = inject(Router);
  constructor(public dialog: MatDialog) {
    console.log(this.isLoadingResults)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes:', this.isPosting);
    if (changes['data'] && this.data) {
      this.dataSource.data = this.isPosting ? this.data : [...this.dataSource.data, ...this.data];
    }
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.firstPageLabel = 'Primera';
    this.paginator._intl.lastPageLabel = 'Última';

    // Emitir evento cuando cambia la paginación
    this.paginator.page
      .pipe(
        tap(() => this.emitPageChange())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
  }

  adjustPaginator() {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    const total = this.dataSource.data.length;

    if ((pageIndex * pageSize) >= total) {
      this.paginator.pageIndex = Math.max(0, Math.ceil(total / pageSize) - 1);
    }
  }

  emitPageChange() {
    if (!this.paginator) return;

    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    const totalPages = this.paginator.getNumberOfPages();
    console.log('totalPages:', totalPages);
    const isLastPage = pageIndex === totalPages - 1;
    this.pageChange.emit({ pageIndex, pageSize, lastPage: isLastPage ? pageIndex : -1, totalPages: totalPages });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(element: any) {
    const datosOriganles = { ...element };
    this.editarEvento.emit(datosOriganles);
  }

  delete(element: any) {
    this.eliminarEvento.emit(element);
  }

  public navigacion(): void {
    console.log('navigacion:', this.urlNavigarion);
    this.router.navigateByUrl(this.urlNavigarion);
  }

  //abre el dilogo de formulario
  openDialog(): void {

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      data: this.camposDinamicos
    });

    dialogRef.backdropClick().subscribe(() => {

    });

    dialogRef.beforeClosed().subscribe(result => {
      console.log('The dialog was closed', result);

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado', result);
      if (result.length === 0) return;
      this.onSave.emit(result);



    });
  }

  // Método para verificar si los datos fueron modificados
  private _isDataModified(originalData: any, editedData: any): boolean {
    // Convierte los objetos a cadenas JSON
    const originalJson = JSON.stringify(originalData).trim();
    const editedJson = JSON.stringify(editedData).trim();

    // Compara las cadenas JSON
    return originalJson !== editedJson;
  }

}


