import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListGanaderoComponent } from './pages/list-ganadero/list-ganadero.component';
import { RegisterGanaderoComponent } from './pages/register-ganadero/register-ganadero.component';
import { FiltrarImageMarcaComponent } from './pages/filtrarImageMarca/filtrarImageMarca.component';

import { Error404PageComponent } from '../../../../shared/pages/error404-page/error404-page.component';
import { ViewFileComponent } from '../../../../shared/components/viewFile/viewFile.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'list', // Redirige automáticamente a la ruta 'list'
    pathMatch: 'full' // Asegura que la redirección sea solo para la ruta vacía
  },
  {
    path: 'list',
    component: ListGanaderoComponent
  },
  {
    path: 'add',
    component: RegisterGanaderoComponent
  },
  {
    path: 'edit/:id',
    component: RegisterGanaderoComponent
  },
  {
    path: 'filtrarImageMarca',
    component: FiltrarImageMarcaComponent
  },
  {
    path: 'viewFile',
    component: ViewFileComponent
  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
  // {
  //   path: ':id',
  //   component: RegisterPageComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GanaderoRoutingModule { }
