import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard-layuot/dashboard.component';
import { Error404PageComponent } from '../../shared/pages/error404-page/error404-page.component';

const routes: Routes = [

  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '', // Ruta vacía para redireccionar a users
        pathMatch: 'full', // Se asegura de que la ruta vacía coincida exactamente
        redirectTo: 'users', // Redirige a la ruta de usuarios por defecto
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'history',
        loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryModule),

      },
      {
        path: 'roles',
        loadChildren: () => import('./pages/roles/roles.module').then(m => m.RolesModule),

      },
      {
        path: 'ganadero',
        loadChildren: () => import('./pages/ganadero/ganadero.module').then(m => m.GanaderoModule),
      },
      {
        path: '404',
        component: Error404PageComponent,
      },
      {
        path: '**',
        redirectTo: '404',
      }

    ]


  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
