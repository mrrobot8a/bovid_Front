import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListHistoryPageComponent } from './pages/list-page/list-page.component';

const routes: Routes = [
  {
    path:'',
    component: ListHistoryPageComponent,
    children: [
      {path: 'list',component: ListHistoryPageComponent},
    ]

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule { }
