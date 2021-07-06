import { Component, OnInit } from '@angular/core';

// SERVICES
import { ProductsService } from '../services/products.service';

// MODELS
import { Product } from '../models/product.model';

// import Swiper core and required modules
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay
} from 'swiper/core';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {
  
  constructor(  private porductService: ProductsService ) { }

  ngOnInit(): void {

    this.cargarProductos();

  }

  /** ================================================================
   *  CARGAR PRODUCTOS
  ==================================================================== */
  public productos: Product[] = [];
  cargarProductos(){

    this.porductService.cargarProductos()
        .subscribe(
          ({ total, products }) =>{

            this.productos = products;            
  
          }, (err) => { console.log('Error: ', err); }
          
        );


  }

  /** ================================================================
   *  SELECCIONAR PRODUCTO PARA EL MODAL
  ==================================================================== */
  public productoM: Product | undefined;
  productoModal(producto: Product){

    this.productoM = producto;

  }

}
