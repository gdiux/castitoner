import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULES
import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';

// COMOPONENTS
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { PedidosComponent } from './pedidos/pedidos.component';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProfileComponent,
    PedidosComponent
  ],
  exports: [
    PagesComponent,
    DashboardComponent,
    ProfileComponent,
    PedidosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPrintModule
  ]
})
export class PagesModule { }
