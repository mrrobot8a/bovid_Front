import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { Error404PageComponent } from '../../../../shared/pages/error404-page/error404-page.component';

// localhost:4200/users
const routes: Routes = [
  {
    path: '',
    redirectTo: 'list', // Redirige automáticamente a la ruta 'list'
    pathMatch: 'full' // Asegura que la redirección sea solo para la ruta vacía
  },
  {
    path: 'list',
    component: ListPageComponent
  },
  {
    path: 'add',
    component: RegisterPageComponent
  },
  {
    path: 'edit/:id',
    component: RegisterPageComponent
  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
  {
    path: ':id',
    component: RegisterPageComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    { provide: 'menuRoutes', useValue: routes }
  ]
})
export class UsersRoutingModule { }
