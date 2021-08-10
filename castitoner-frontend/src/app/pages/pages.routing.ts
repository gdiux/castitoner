import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// GUARD
import { AuthGuard } from '../guards/auth.guard';

// COMPONENTS
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    

      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data:{ titulo: 'Dashboard'} },
      { path: 'perfil', component: ProfileComponent, canActivate: [AuthGuard], data:{ titulo: 'Perfil'} },
      { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard], data:{ titulo: 'Pedidos'} },  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
