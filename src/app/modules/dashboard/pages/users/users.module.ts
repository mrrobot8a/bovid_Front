import { NgModule } from '@angular/core';


import { UsersRoutingModule } from './users-routing.module';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MaterialModule } from '../../../../shared/material/material.module';
import { CustomSidenavComponent } from '../../../../shared/components/custom-sidenav/custom-sidenav.component';
import { CustomTableComponent } from '../../../../shared/components/Custom-table/Custom-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../../shared/shared.module';



@NgModule({
    declarations: [
        LayoutPageComponent,
        RegisterPageComponent,
        ListPageComponent
    ],
    providers: [provideHttpClient(withFetch())],
    imports: [
        CommonModule,
        SharedModule,
        UsersRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        CustomSidenavComponent,
        CustomTableComponent
    ]
})
export class UsersModule { }
