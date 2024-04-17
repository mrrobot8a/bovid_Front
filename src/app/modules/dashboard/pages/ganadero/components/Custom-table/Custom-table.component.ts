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

  router = inject(Router);
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
    this.editarEvento.emit(datosOriganles);
    console.log('Datos del formulario de edición:', datosOriganles);

  }

  delete(element: any) {
    // Implementa la lógica de eliminación aquí
    console.log('Deleting', element);
    this.delete(element);
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



// /** Builds and returns a new User. */
// function createNewElement(position: number): PeriodicElement {
//   const users = ['Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen', 'Fluorine', 'Neon'];
//   const ips = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'];

//   const userIndex = Math.floor(Math.random() * users.length);
//   const ipIndex = Math.floor(Math.random() * ips.length);

//   return {
//     user: users[userIndex],
//     position: position,
//     fecha: parseInt((Math.random() * 50).toFixed(4)), // Genera un valor aleatorio entre 0 y 50
//     ip: ips[ipIndex]
//   };
// }

// export interface PeriodicElement {
//   user: string;
//   position: number;
//   fecha: number;
//   ip: string;

// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   { position: 1, user: 'Hydrogen', fecha: 1.0079, ip: 'H' },
//   { position: 2, user: 'Helium', fecha: 4.0026, ip: 'He' },
//   { position: 3, user: 'Lithium', fecha: 6.941, ip: 'Li' },
//   { position: 4, user: 'Beryllium', fecha: 9.0122, ip: 'Be' },
//   { position: 5, user: 'Boron', fecha: 10.811, ip: 'B' },
//   { position: 6, user: 'Carbon', fecha: 12.0107, ip: 'C' },
//   { position: 7, user: 'Nitrogen', fecha: 14.0067, ip: 'N' },
//   { position: 8, user: 'Oxygen', fecha: 15.9994, ip: 'O' },
//   { position: 9, user: 'Fluorine', fecha: 18.9984, ip: 'F' },
//   { position: 10, user: 'Neon', fecha: 20.1797, ip: 'Ne' },
//   { position: 11, user: 'Sodium', fecha: 22.9897, ip: 'Na' },
//   { position: 12, user: 'Magnesium', fecha: 24.305, ip: 'Mg' },
//   { position: 13, user: 'Aluminum', fecha: 26.9815, ip: 'Al' },
//   { position: 14, user: 'Silicon', fecha: 28.0855, ip: 'Si' },
//   { position: 15, user: 'Phosphorus', fecha: 30.9738, ip: 'P' },
//   { position: 16, user: 'Sulfur', fecha: 32.065, ip: 'S' },
//   { position: 17, user: 'Chlorine', fecha: 35.453, ip: 'Cl' },
//   { position: 18, user: 'Argon', fecha: 39.948, ip: 'Ar' },
//   { position: 19, user: 'Potassium', fecha: 39.0983, ip: 'K' },
//   { position: 20, user: 'Calcium', fecha: 40.078, ip: 'Ca' },
// ];

