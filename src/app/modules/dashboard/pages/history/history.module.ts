import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { CustomTableComponent } from '../../../../shared/components/Custom-table/Custom-table.component';
import { ListHistoryPageComponent } from './pages/list-page/list-page.component';


@NgModule({
  declarations: [
    ListHistoryPageComponent
  ],
  imports: [
    CommonModule,
    HistoryRoutingModule,
    CustomTableComponent,
  ]
})

export class HistoryModule { }
