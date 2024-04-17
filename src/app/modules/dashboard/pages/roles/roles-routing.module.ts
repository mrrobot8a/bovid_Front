import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from '../../../../shared/pages/error404-page/error404-page.component';
import { ListRolPageComponent } from './pages/list-page/lsit_rol_page.component';

// localhost:4200/roles
const routes: Routes = [
  {
    path: '',
    redirectTo: 'list', // Redirige automáticamente a la ruta 'list'
    pathMatch: 'full' // Asegura que la redirección sea solo para la ruta vacía
  },
  {
    path: 'list',
    component: ListRolPageComponent
  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    { provide: 'menuRoutes', useValue: routes }
  ]
})
export class RolesRoutingModule { }
