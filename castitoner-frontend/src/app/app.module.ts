import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// MODULES
import { SwiperModule } from 'swiper/angular';
import { PipesModule } from './pipes/pipes.module';
import { PagesModule } from './pages/pages.module';

// COMPONENTS
import { HomeComponent } from './home/home.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { ContactComponent } from './contact/contact.component';
import { CartComponent } from './cart/cart.component';
import { BreadcrumsComponent } from './shared/breadcrums/breadcrums.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NopagefoundComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ProductComponent,
    SearchComponent,
    ContactComponent,
    CartComponent,
    BreadcrumsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SwiperModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    PipesModule,
    PagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
