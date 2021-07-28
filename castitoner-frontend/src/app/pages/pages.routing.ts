import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// GUARD
import { AuthGuard } from '../guards/auth.guard';

// COMPONENTS
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
    
    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
    
          { path: '', component: DashboardComponent, data:{ titulo: 'Dashboard'} },
              
        ]
      },    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
