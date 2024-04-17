import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanaderoRoutingModule } from './ganadero-routing.module';
import { MaterialModule } from '../../../../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomSidenavComponent } from '../../../../shared/components/custom-sidenav/custom-sidenav.component';
import { CustomTableComponent } from '../../../../shared/components/Custom-table/Custom-table.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ListGanaderoComponent } from './pages/list-ganadero/list-ganadero.component';
import { RegisterGanaderoComponent } from './pages/register-ganadero/register-ganadero.component';
import { CustomTableGanaderoComponent } from './components/Custom-table/Custom-table.component';
import { FiltrarImageMarcaComponent } from './pages/filtrarImageMarca/filtrarImageMarca.component';
import { AlertFilterComponent } from "./components/AlertFilter/AlertFilter.component";


@NgModule({
    declarations: [
        ListGanaderoComponent,
        RegisterGanaderoComponent,
        FiltrarImageMarcaComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        GanaderoRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        CustomSidenavComponent,
        CustomTableGanaderoComponent,
        AlertFilterComponent
    ]
})
export class GanaderoModule { }
