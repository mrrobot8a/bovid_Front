import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormStatus } from '../../../users/interface/form_status.enum';
import { RoleService } from '../../service/role.service';
import { mapToRoleModelTable } from '../../helper/mappers/rolePaginationToModelTable';
import Swal from 'sweetalert2';
import { DialogData } from '../../../../../../shared/components/modals/modal/dialog/dialog.component';
import { Validators } from '@angular/forms';
import { RoleModelTable } from '../../interface/roleModelTable.interface';

@Component({
  selector: 'list-page-rol',
  standalone: false,
  templateUrl: './list_rol_page.component.html',
  styleUrl: './list_rol_page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListRolPageComponent implements OnInit {



  onEliminar($event: any) {
    throw new Error('Method not implemented.');
  }



  ngOnInit(): void {
    console.log('Init ListRolPageComponent');
    this.getAllRoles({ pageIndex: this.pageIndex, pageSize: this.pageSize });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Desuscribirse al destruir el componente
  }

  title: string = 'Lista de Roles';

  constructor(private roleService: RoleService) { }

  // subscription para desuscribirse al destruir el componente
  private subscription: Subscription = new Subscription();

  // Señal para almacenar los datos de los usuarios y obtener
  private _data = signal<any | null>(null);
  public getDataHistory = computed(() => this._data());
  // Señal para almacenar el estado de la petición de guardar un nuevo usuario
  private _statusData = signal<boolean>(false);
  public statusData = computed(() => this._statusData());

  public isPosting = computed(() => this._statusData());

  private formStatus = signal<FormStatus>(FormStatus.isNoPosting);
  public isStatusSolicitudHttp = computed(() => this.formStatus());

  public isLoading = true;

  // Considera iniciar pageIndex y pageSize con valores por defecto si es necesario
  private pageIndex: number = 0;
  pageSize: number = 30;
  totalPages: number = 0;
  showColumnActions = true;

  readonly configuracionDelFormulario = {
    codRole: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.maxLength(100)]],
    authority: ['', [Validators.required, Validators.minLength(3)]],
    status: [true, [Validators.required]],
    id: ['']
  }

  readonly camposDinamicos: DialogData = {

    campos: {
      id:{
        title: 'id',
        tipo: 'input',
      },
      codRole: {
        title: 'Código de Rol',
        tipo: 'input',
      },

      authority: {
        title: 'nombre rol',
        tipo: 'input',
      },
      description: {
        title: 'Descripción',
        tipo: 'textarea',
      },
      status: {
        title: 'Activar Rol',
        tipo: 'checkbox',
        valor: true,
      }
    },
    configuracionDelFormulario: this.configuracionDelFormulario,
  }



  onPageChange(event: { pageIndex: number, pageSize: number, lastPage: number, totalPages: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.totalPages = event.totalPages;
    this.getAllRoles({ pageIndex: this.pageIndex, pageSize: this.pageSize });
  }

  private getAllRoles(options: { pageIndex: number, pageSize: number }): void {
    this.isLoading = true;
    this.subscription.add(
      this.roleService.getAllRoles(options.pageIndex, options.pageSize).subscribe({
        next: (response) => {
          console.log("data roels:", response.roles.content);
          console.log('mapperDataRole:', mapToRoleModelTable(response.roles.content));

          this._data.set(mapToRoleModelTable(response.roles.content));
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.log('Error en la petición de obtener roles:', error);
          this.isLoading = false;
          // Establecer un retraso antes de mostrar la alerta
          setTimeout(() => {
            Swal.fire({
              title: 'Error',
              text: error,
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 2500
            });
          }, 1000);

        }
      }));

  }


  onSave($event: any) {
    console.log('Guardar DESDE EL PADRE Role:', $event);
    this._saveRole($event);

  }

  private _saveRole(user: any) {
    console.log('saveUser:', user);


    this._statusData.set(true);
    this.isLoading = true;
    this.formStatus.set(FormStatus.isPosting);
    // Lógica para guardar el nuevo usuario
    this.subscription.add(

      this.roleService.saveRole(user).subscribe({
        next: (response) => {
          console.log(response);
          if (response && response.role) { // Asumiendo que la respuesta tiene un campo `user`
            // Preparar el nuevo usuario para agregarlo al principio de la lista
            const newUser = mapToRoleModelTable([response.role])[0]; // Asume que tu función puede manejar arrays y devuelve un array
            console.log('newUser:', newUser);
            // Obtener la lista actual de usuarios y agregar el nuevo usuario al principio
            const currentUsers = this._data() ? this._data().slice() : [];
            currentUsers.unshift(newUser); // Añade al principio
            this.formStatus.set(FormStatus.isPostingSuccessfully);
            // Actualizar la señal con la nueva lista de usuarios
            this._data.set(currentUsers);
            this.isLoading = false;
            // No necesitas llamar a loadHistoryData si solo estás añadiendo un nuevo usuario a la lista existente
          }

        },
        complete: () => {

        },
        error: (error) => {
          console.log(error);
          console.error('Error fetching history:', error);

          // Establecer un retraso antes de mostrar la alerta
          setTimeout(() => {
            Swal.fire({
              title: 'Error',
              text: error,
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 2500
            });
          }, 5000);

          this.isLoading = false;
          this.formStatus.set(FormStatus.isPostingFailed);
        }
      }),
    );

  }

  onEditar(event:RoleModelTable) {
    console.log('Editar DESDE EL PADRE Role:', event);
    this._updateRole(event);


  }

  private _updateRole(role: any) {

    console.log('saveUser:', role);
    this._statusData.set(true);
    this.isLoading = true;
    this.formStatus.set(FormStatus.isPosting);
    // Lógica para guardar el nuevo usuario
    this.subscription.add(

      this.roleService.updateRole(role).subscribe({
        next: (response) => {
          console.log(response);
          if (response && response.role) { // Asumiendo que la respuesta tiene un campo `user`
            console.log('newUser:', mapToRoleModelTable([response.role])[0]);
            // Preparar el nuevo usuario para agregarlo al principio de la lista
            const newUser = mapToRoleModelTable([response.role])[0]; // Asusume que tu función puede manejar arrays y devuelve un array
            console.log('newUser:', newUser);
            // Obtener la lista actual de usuarios y agregar el nuevo usuario al principio
            const currentUsers = this._data() ? this._data().slice() : [];
            const editedUserIndex = currentUsers.findIndex((u: { id: number; }) => u.id === newUser.id);
            if (editedUserIndex !== -1) { // Si el usuario editado existe en la lista
              // Reemplazar el usuario editado con el nuevo usuario en la misma posición
              currentUsers[editedUserIndex] = newUser;

              // Actualizar la señal con la nueva lista de usuarios
              this._data.set(currentUsers);
            }

            this.formStatus.set(FormStatus.isPostingSuccessfully);
            this.isLoading = false;
            // No necesitas llamar a loadHistoryData si solo estás añadiendo un nuevo usuario a la lista existente
          }

        },
        complete: () => {

        },
        error: (error) => {
          console.log(error);
          console.error('Error fetching history:', error);

          // Establecer un retraso antes de mostrar la alerta
          setTimeout(() => {
            Swal.fire({
              title: 'Error',
              text: error,
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 2500
            });
          }, 5000);

          this.isLoading = false;
          this.formStatus.set(FormStatus.isPostingFailed);
        }
      }),
    );
  }


}
