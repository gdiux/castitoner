import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENTS
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { ContactComponent } from './contact/contact.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data:{ titulo: 'Inicio'} },
  { path: 'about', component: AboutComponent, data:{ titulo: 'Nosotros'} },
  { path: 'product/:id', component: ProductComponent, data:{ titulo: 'Producto'} },
  { path: 'search', component: SearchComponent, data:{ titulo: 'Buscador'} },
  { path: 'contac', component: ContactComponent, data:{ titulo: 'Contacto'} },
  { path: 'cart', component: CartComponent, data:{ titulo: 'Mi Carrito'} },
  { path: '**', component: NopagefoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
