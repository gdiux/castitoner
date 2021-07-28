import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULES
import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMOPONENTS
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProfileComponent
  ],
  exports: [
    PagesComponent,
    DashboardComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class PagesModule { }
