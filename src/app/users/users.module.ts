import { NgModule } from '@angular/core';


import { UsersRoutingModule } from './users-routing.module';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CustomSidenavComponent } from "../shared/components/custom-sidenav/custom-sidenav.component";
import { CustomTableComponent } from '../shared/components/Custom-table/Custom-table.component';


@NgModule({
    declarations: [
        LayoutPageComponent,
        RegisterPageComponent,
        ListPageComponent
    ],
    providers: [provideHttpClient(withFetch())],
    imports: [
        CommonModule,
        UsersRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        CustomSidenavComponent,
        CustomTableComponent
    ]
})
export class UsersModule { }
