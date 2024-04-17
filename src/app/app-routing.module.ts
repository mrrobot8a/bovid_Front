import { LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { isAuthenticatedGuard } from './modules/auth/guards/isAuthenticated.guard';
import { isNoAuthenticatedGuardTsGuard } from './modules/auth/guards/is-noAuthenticated.guard.ts.guard';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

// dominio.com/
// este el routing padre que gestiona las rutas hijas
const routes: Routes = [
  {
    path: 'auth',
    canActivate:[isNoAuthenticatedGuardTsGuard],
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'dashboard',
    canActivate:[isAuthenticatedGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),

  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    path: '',
    redirectTo: 'auth/login', //-> redirecciona a la ruta auth/login cuando el path es vacio
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404',
  }
];
registerLocaleData(es);
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ { provide: LOCALE_ID, useValue: 'es-PE' } ]
})
export class AppRoutingModule { }
