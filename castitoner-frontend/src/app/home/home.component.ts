import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

// SERVICES
import { ProductsService } from '../services/products.service';

// MODELS
import { Product } from '../models/product.model';
import { Carrito } from '../models/carrito.model';

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

  /** ================================================================
   *  AGREGAR AL CARRITO
  ==================================================================== */
  public carrito: Carrito[] = [];
  public local: any;
  agregarCarrito(product: Product, qty: number ){

    if (localStorage.getItem('carrito')) {

      // CARRITO LOCAL
      this.local = localStorage.getItem('carrito');
      this.carrito = JSON.parse(this.local);

      const validarItem = this.carrito.findIndex( (resp) =>{      
        if (resp.product === product.pid ) {
          return true;
        }else {
          return false;
        }
      });

      if ( validarItem === -1 ) {

        // AGREGAMOS EL PRODUCTO
        this.carrito.push({
          product: product.pid,
          name: product.name,
          img: product.img,
          qty,
          price: product.price
        });

      }else{
        
        let qtyTemp = Number(this.carrito[validarItem].qty);
        qtyTemp += Number(qty);

        this.carrito[validarItem].qty = qtyTemp;
        
      }
    }else{

      // AGREGAMOS EL PRODUCTO
      this.carrito.push({
        product: product.pid,
        name: product.name,
        img: product.img,
        qty,
        price: product.price
      });

    }

    localStorage.setItem('carrito', JSON.stringify(this.carrito));

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      text: 'Se ha agregado con exito',
      showConfirmButton: false,
      backdrop: 'rgba(0,0,0, 0.0)',
      timer: 1000
    });
    
  }

}
