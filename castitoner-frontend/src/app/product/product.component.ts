import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

// MODELS
import { Product } from '../models/product.model';

// SERVICES
import { ProductsService } from '../services/products.service';
import { CarritoService } from '../services/carrito.service';
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
  selector: 'app-product',
  templateUrl: './product.component.html',
  styles: [
  ]
})
export class ProductComponent implements OnInit {

  public carrtioServicio: Carrito[] = [];

  constructor(  private porductService: ProductsService,
                private activatedRoute: ActivatedRoute,
                private carritoService: CarritoService) { 

                  
                  
                }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => {
      
      this.cargarProducto(id);
      
    });   
  

    /** ================================================================
     *  LOCALSTORAGE
    ==================================================================== */
    this.carrtioServicio = this.carritoService.carrito;

    // CARRITO LOCAL
    if (localStorage.getItem('carrito')) {
      this.local = localStorage.getItem('carrito');
      this.carrito = JSON.parse(this.local);
    }else{
      this.carrito = [];
    }

    this.carrtioServicio = this.carrito;

  }

  /** ================================================================
     *  SWIPER
    ==================================================================== */
  public swiperConfig: any = {
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
          990: {
              slidesPerView: 4,
              spaceBetween: 50
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 40
        }
      }
  }

  /** ================================================================
   *  SCROLL
  ==================================================================== */
  scrollTop(){
    let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, pos - 50); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 16);
  }
  /** ================================================================
   *  CARGAR PRODUCTOS
  ==================================================================== */
  public producto: Product | undefined;
  cargarProducto(id: string){

    this.porductService.cargarProductoId(id)
        .subscribe(
          ({ product }) =>{

            this.producto = product;

            this.cargarProductos(this.producto.department._id);
            this.scrollTop();
  
          }, (err) => { console.log('Error: ', err); }
          
        );
  }

  /** ================================================================
   *  CARGAR PRODUCTOS POR DEPARTAMENTOS
  ==================================================================== */
  public productos: Product[] | undefined;
  cargarProductos(departamento: string){

    this.porductService.cargarProductoDepartamento(departamento)
        .subscribe(({ total, products })=> {

          this.productos = products;

        });
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

      // AGREGAMOS EL PRODUCTO textColor
      this.carrito.push({
        product: product.pid,
        name: product.name,
        img: product.img,
        qty,
        price: product.price
      });

    }

    localStorage.setItem('carrito', JSON.stringify(this.carrito));

    this.carritoService.upCarrito(this.carrito);

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
