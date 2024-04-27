import { Component, Inject, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { UserService } from '../../service/user.service';
import { mapToUserModelTable } from '../../helper/service/mappers/userResponsetoUserModelTable';
import { UserRegistration } from '../../interface/user-register';
import { Validators } from '@angular/forms';
import { DialogData } from '../../../../../../shared/components/modals/modal/dialog/dialog.component';
import { FormStatus } from '../../interface/form_status.enum';
import Swal from 'sweetalert2';
import { mapRoleFromApiToRole } from '../../../roles/helper/mappers/role.mappers';
import { UserModelTable } from '../../interface';
import e from 'express';
import { RoleService } from '../../../roles/service/role.service';
import { Content } from '../../../roles/interface/role_pegination_response.interface';


@Component({
  selector: 'app-list-page-users',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit, OnDestroy {

  constructor(private _userService: UserService, private _roleService: RoleService) {}





  private loadRolesAndInitForm(): void {
    this.subscription.add(
      this._roleService.getAllRoles(this.pageIndex, this.pageSize).subscribe({
        next: (response) => {
          const rolesActivos = mapToRoleSelectTipoUsuario(response.roles.content);
          console.log('rolesActivos:', rolesActivos );
          // Ajustar el formato de rolesActivos para que coincida con lo que espera opciones
          // Ajustar el formato de rolesActivos para que coincida con lo que espera opciones
          this.camposDinamicos!.campos!['roles'].opciones! = rolesActivos.map(rol => ({
            valor: rol.valor || '',
            vista: rol.valor || ''
          }));
        },
        error: (error) => { console.error('Error fetching roles:', error); }
      })
    );
  }

  rolesActivos = signal<TipoUsuario[]>([]);

  title: string = 'Lista de usuarios';
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


  //validaciones de los campos del formulario
  readonly configuracionDelFormulario = {
    firstName: ['', [Validators.required, Validators.minLength(6)]],
    lastName: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]],
    roles: ['', Validators.required],
    position: ['', [Validators.required, Validators.minLength(2)]],
    numberPhone: ['', [Validators.required, Validators.minLength(10)]],
    enabled: [true, Validators.required],
    id: ['']



  };
  // Campos dinámicos del formulario de registro de usuario
  readonly camposDinamicos: DialogData = {
    campos: {
      id: {
        title: 'id',
        tipo: 'input',
      },
      firstName: {
        title: 'Nombre Completo',
        tipo: 'input',
      },
      lastName: {
        title: 'Apellido Completo',
        tipo: 'input',
        validaciones: [{ tipo: 'required' }, { tipo: 'minLength', valor: 6 }]
      },
      email: {
        title: 'Correo electrónico',
        tipo: 'input',
        validaciones: [{ tipo: 'required' }, { tipo: 'minLength', valor: 2 }]
      },
      password: {
        title: 'Contraseña',
        tipo: 'input',
        validaciones: [{ tipo: 'required' }]
      },
      roles: {
        title: 'Tipo de Rol',
        tipo: 'select',
        opciones: [{ valor: 'Administrador', vista: 'Administrador' }, { valor: 'Usuario', vista: 'Usuario' }]
      },
      position: {
        title: 'Posición',
        tipo: 'input',
        validaciones: [{ tipo: 'required' }]
      },
      numberPhone: {
        title: 'Número de teléfono',
        tipo: 'input',
        validaciones: [{ tipo: 'required' }, { tipo: 'minLength', valor: 2 }]
      },
      enabled: {
        title: 'Habilitar correo',
        tipo: 'checkbox',
        valor: true
      }

    }
    ,
    configuracionDelFormulario: this.configuracionDelFormulario
  };




  ngOnInit(): void {
    console.log('listuser');
    this.loadHistoryData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
    this.loadRolesAndInitForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Desuscribirse al destruir el componente
  }




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
      this.loadHistoryData({ pageIndex: event.totalPages - 1, pageSize: 30 });
    }

  }

  onSave(event: UserModelTable) {
    console.log('event:', event);
    event.roles = mapRoleFromApiToRole(event.roles);
    console.log('event:', event);
    this._saveUser(event);
  }


  private _saveUser(user: any) {
    console.log('saveUser:', user);


    this._statusData.set(true);
    this.isLoading = true;
    this.formStatus.set(FormStatus.isPosting);
    // Lógica para guardar el nuevo usuario
    this.subscription.add(

      this._userService.saveUser(user).subscribe({
        next: (response) => {
          console.log(response);
          if (response && response.user) { // Asumiendo que la respuesta tiene un campo `user`
            // Preparar el nuevo usuario para agregarlo al principio de la lista
            const newUser = mapToUserModelTable([response.user])[0]; // Asume que tu función puede manejar arrays y devuelve un array
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

          Swal.update({
            title: 'Error',
            text: error,
            icon: 'error',
            showConfirmButton: false,
            allowOutsideClick: false,
            showCloseButton: true,
          });


          this.isLoading = false;
          this.formStatus.set(FormStatus.isPostingFailed);
        }
      }),
    );

  }

  private loadHistoryData(options: { pageIndex: number, pageSize: number }): void {
    console.log('size:', options.pageSize);
    this.isLoading = true;
    this.subscription.add(
      this._userService.getAllUsers(options.pageIndex, options.pageSize).subscribe({
        next: (response) => {

          // Asegúrate de corregir la ortografía si fue un error
          // this._data.set(mapToUserModelTable(response.Users.content));
          console.log('Data received ListUser:', response.users.content);
          // this._data.set(mapToUserModelTable(response.Users.content));
          console.log('Data received ListUser:', mapToUserModelTable(response.users.content));
          this._data.set(mapToUserModelTable(response.users.content));
          this.isLoading = false;
        },
        error: (error) => {
          console.log('Error fetching history:', error);
          localStorage.clear();
          if (error.status === 0 || error.message === "Error en el servidor") {
            Swal.fire({
              title: 'Error',
              text: 'Error en el servidor , intentelo mas tarde...',
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              showCloseButton: true,
            });
          }
          if(error.status === 400){
            Swal.fire({
              title: 'Error',
              text: error.error.message,
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              showCloseButton: true,
            });
          }
          if(error.status === 403){
            Swal.fire({
              title: 'Error',
              text: 'Vuelva a iniciar sesión...',
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              showCloseButton: true,
            });
          }
          this.isLoading = false;
        }
      }));
  }



  onEditar(event: UserModelTable) {
    console.log('Editar DESDE EL PADRE:', event);

    console.log('event:', event);
    event.roles = mapRoleFromApiToRole(event.roles);
    console.log('event:', event);
    this._editUser(event);
    // Lógica para manejar la edición
  }

  private _editUser(user: any) {
    console.log('saveUser:', user);
    this._statusData.set(true);
    this.isLoading = true;
    this.formStatus.set(FormStatus.isPosting);
    // Lógica para guardar el nuevo usuario
    this.subscription.add(

      this._userService.editUser(user).subscribe({
        next: (response) => {
          console.log(response);
          if (response && response.user) { // Asumiendo que la respuesta tiene un campo `user`
            console.log('newUser:', mapToUserModelTable([response.user])[0]);
            // Preparar el nuevo usuario para agregarlo al principio de la lista
            const newUser = mapToUserModelTable([response.user])[0]; // Asume que tu función puede manejar arrays y devuelve un array
            console.log('newUser:', newUser);
            // Obtener la lista actual de usuarios y agregar el nuevo usuario al principio
            const currentUsers = this._data() ? this._data().slice() : [];
            const editedUserIndex = currentUsers.findIndex((u: { email: String; }) => u.email === newUser.email);
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

  onEliminar(row: any) {
    console.log('Eliminar DESDE EL PADRE:', row);
    // Lógica para manejar la eliminación
  }

}



export interface TipoUsuario {
  valor?: string;
  vista?: string;
}

export function mapToRoleSelectTipoUsuario(data: Content[]): TipoUsuario[] {

  return data.map((item) => ({
    valor: item.authority,
    vista: item.description,
  }));



}
