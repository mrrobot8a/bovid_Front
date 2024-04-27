import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ResetPasswordComponent } from './pages/resetPassword/resetPassword.component';
import { ChangedPasswordComponent } from './pages/changedPassword/changedPassword.component';

// localhost:4200/auth/
// esta son rutas hijas del enrutador principal routing.module
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'new-account', component: RegisterPageComponent },
      { path: 'resetPassword', component: ResetPasswordComponent },
      { path: 'change-password', component: ChangedPasswordComponent },
      { path: '**', redirectTo: 'login' },
    ]
  }
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
