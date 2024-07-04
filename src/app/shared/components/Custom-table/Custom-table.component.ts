import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { tap } from 'rxjs';
import { DialogComponent, DialogData } from '../modals/modal/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FormStatus } from '../../../modules/dashboard/pages/users/interface/form_status.enum';


@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [
    CommonModule, MaterialModule,
    MatTableModule, MatPaginatorModule, MatSortModule
  ],
  exportAs: 'appCustomTable',
  templateUrl: './Custom-table.component.html',
  styleUrl: './Custom-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTableComponent<T> implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() data: T[] | null = null;
  @Input() columnNames: { [key: string]: string } = {};
  @Input() displayedColumns: string[] = [];
  @Input() showColumnActions = false;
  @Input() title!: string;
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

  constructor(public dialog: MatDialog) {
    console.log(this.isLoadingResults)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes:', this.isPosting);
    if (changes['data'] && this.data) {

      this.dataSource.data = this.isPosting ? this.data : [...this.dataSource.data, ...this.data];
      console.log('data:', this.data);
    }
  }


  ngOnInit(): void {
    console.log('isLoadingResults:', this.isLoadingResults)
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.firstPageLabel = 'Primera';
    this.paginator._intl.lastPageLabel = 'Última';


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
    if (!this.paginator) return; // Asegurarse de que el paginador esté inicializado

    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    const totalPages = this.paginator.getNumberOfPages(); // El total de elementos en todas las páginas.
    console.log('totalPages:', totalPages);
    // Determina si estás en la última página.
    const isLastPage = pageIndex === totalPages - 1;
    // console.log('isLoadingPader', this.isLoading);
    // isLastPage && this.isLoading ? this.isLoadingResults = true : this.isLoadingResults = false;

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
    // Implementa la lógica de edición aquí
    console.log('Editing', element);

    const datosOriganles = { ...element };

    const dialogData: DialogData = {
      ...this.camposDinamicos,
      datosActuales: element // Pasas los datos actuales al diálogo
    };

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      data: dialogData
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.length === 0) return;
        console.log('datosOriganles:', datosOriganles);
        console.log('result:', result);
        if (!this._isDataModified(datosOriganles, result)) {
          console.log('No se han modificado los datos');
          return;
        }

        this.editarEvento.emit(result);
        // Manejar los resultados del formulario de edición aquí
        console.log('Datos del formulario de edición:', result);
      }
    });
  }

  delete(element: any) {
    // Implementa la lógica de eliminación aquí
    console.log('Deleting', element);
  }

  //abre el dilogo de formulario PARA GUARDAR DATA
  openDialog(): void {

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      data: this.camposDinamicos
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
    return originalJson !== editedJson;
  }





}



