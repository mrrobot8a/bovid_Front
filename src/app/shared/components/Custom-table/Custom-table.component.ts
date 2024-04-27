import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Historial } from '../../../modules/dashboard/pages/history/interfaces/history.interface';
import { Console } from 'console';
import { tap } from 'rxjs';
import { DialogComponent, DialogData } from '../modals/modal/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
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
  styles: `
//     .mat-column-select {
//   overflow: initial;
// }
 .container-header{
     display:flex;
      justify-content:space-between;
      align-items: center;
 }
 .mat-mdc-table {
  width: 100%;
  max-height: 500px;
  overflow: auto;
}

.mat-column-name {
  height: 100px;
}



/* Estilos opcionales para alternar el color de las filas */
tr:nth-child(even) {
  background-color: #f2f2f2; /* Color de fondo para las filas pares */
}

.mat-mdc-row .mat-mdc-cell {
  border-bottom: 1px solid transparent;
  border-top: 1px solid transparent;
  cursor: pointer;
}

.mat-mdc-row:hover .mat-mdc-cell {
  border-color: currentColor;
}

.demo-row-is-clicked {
  font-weight: bold;
}
.mat-mdc-table {
  width: 100%;
  max-height: 500px;
  overflow: auto;
}

.mat-paginator-container {

  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  bottom: 0; /* Puedes ajustar esto según la posición deseada */
  background-color: white; /* Opcional: para dar un fondo blanco al paginador */
  z-index: 1; /* Asegura que el paginador esté sobre el contenido de la tabla */

}

.mat-paginator-container {
  display: flex;
  justify-content: space-between; /* Ajusta los elementos al principio y al final */
  align-items: center;
  position: sticky;
  bottom: 0; /* Ajusta esto según la posición deseada */
  background-color: white; /* Opcional: para dar un fondo blanco al paginador */
  z-index: 1; /* Asegura que el paginador esté sobre el contenido de la tabla */
  padding: 0 20px; /* Añade un poco de espacio a los lados para que no estén pegados al borde */
}

.paginator-left {
  /* Este div englobará al paginador para poder centrarlo correctamente */
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.button-right {
  /* Estilos adicionales para el botón si es necesario */
}


::ng-deep .mat-mdc-paginator-outer-container   {
  border-left: 1px solid black;
  border-radius: 38px;
  background-color: white;
  color: blue;
  margin-bottom: 2px;


}



::ng-deep .mat-mdc-paginator-range-actions {
  border-bottom: 1px solid black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Efecto de elevación */
  border-radius: 38px;
  color:black;

}



::ng-deep .mat-mdc-icon-button[disabled] .mat-mdc-paginator-icon{
  fill:green
}
::ng-deep .mat-mdc-paginator-range-actions button[type="button"]:disabled  svg {

  color:blue;
  fill: red;

}

::ng-deep .mat-mdc-paginator-range-actions button svg{
  background-color: white;
  color:blue;
  fill: black;

}
/* Structure */
.example-container {
  position: relative;
}

.example-table-container {
  position: relative;
  min-height: 200px;
  max-height:  calc(100vh - 100px);
  overflow: auto;
}

table {
  width: 100%;
}

.example-loading-shade {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0px;
  right: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 43px;
}

.example-rate-limit-reached {
  max-width: 360px;
  text-align: center;
}

/* Column Widths */
.mat-column-number,
.mat-column-state {
  max-width: 64px;
}

.mat-column-created {
  max-width: 124px;
}

.mat-mdc-header-cell {
  border-bottom: 1px solid black;
}

.mat-mdc-form-field
{
    width: 500px;
}

.mat-paginator-container #button-right {
  background-color: #335AA4;
  color: white;
  height: 50px;
  border-radius: 10px;
  border: none;
  box-shadow: none;
  margin-right: clamp(0px, 9vw, 150px);

}



  `,
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
          // willOpen: () => {
          //   Swal.showLoading()
          // }
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
      // case FormStatus.isPostingFailed:
      //   Swal.fire({
      //     title: 'Error',
      //     text: 'Error al guardar',
      //     icon: 'error',
      //     showConfirmButton: false,
      //     allowOutsideClick: false,
      //     timer: 15000
      //   })
      //   break;
    }

  }

  @Input() set isLoading(value: boolean) {
    this.isLoadingResults = value; // Aquí actualizas isLoadingResults cada vez que cambie isLoading
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
      // this.adjustPaginator()
      console.log('data:', this.data);
      // this.isLoadingResults = this.isLoading;
    }
  }


  ngOnInit(): void {
    console.log('isLoadingResults:', this.isLoadingResults)

    // Inicialización si es necesaria
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.firstPageLabel = 'Primera';
    this.paginator._intl.lastPageLabel = 'Última';

    // // Resetear a la primera página si cambia el orden de clasificación
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // Emitir evento cuando cambia la paginación
    this.paginator.page
      .pipe(
        tap(() => this.emitPageChange())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    // Limpieza si es necesaria
  }

  adjustPaginator() {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    const total = this.dataSource.data.length;

    // Si los datos actuales no llenan la página actual, se ajusta el índice de la página si es necesario
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

    // Compara las cadenas JSON
    return originalJson !== editedJson;
  }





}



