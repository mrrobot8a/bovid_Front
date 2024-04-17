import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard-layuot/dashboard.component';
import { MaterialModule } from '../../shared/material/material.module';
import { CustomSidenavComponent } from '../../shared/components/custom-sidenav/custom-sidenav.component';
import { UsersModule } from './pages/users/users.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RolesModule } from './pages/roles/roles.module';
import { GanaderoModule } from './pages/ganadero/ganadero.module';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    UsersModule,
    RolesModule,
    GanaderoModule,
    CustomSidenavComponent
  ]
})
export class DashboardModule { }
