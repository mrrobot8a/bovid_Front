import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';

// localhost:4200/users
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'add', component: RegisterPageComponent },
      { path: 'edit/:id', component: RegisterPageComponent },
      { path: 'list', component: ListPageComponent },
      { path: ':id', component: RegisterPageComponent },
      { path: '**', redirectTo: 'list' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    { provide: 'menuRoutes', useValue: routes }
  ]
})
export class UsersRoutingModule { }
