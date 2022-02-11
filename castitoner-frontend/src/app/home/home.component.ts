import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

// SERVICES
import { ProductsService } from '../services/products.service';
import { UserService } from '../services/user.service';

// MODELS
import { Product } from '../models/product.model';
import { Carrito } from '../models/carrito.model';
import { User } from '../models/user.model';

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
  
  constructor(  private porductService: ProductsService,
                private userService: UserService, ) { }

  ngOnInit(): void {

    this.cargarProductos();
    this.cargarUser();

  }

  /** ================================================================
   *  CARGAR USER
  ==================================================================== */
  public login: boolean = false;
  public user!: User;
  cargarUser(){

    if (!localStorage.getItem('token')) {
      this.login = false;
      return;

    }else{
      this.login = true;
      this.userService.validateToken()
      .subscribe( resp => {
        
        if (resp) {
          this.user = this.userService.user;                    
          
        }else{

          localStorage.removeItem('token');
          window.location.reload();

        }
        

      });
    }
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
  public stock: any;
  public stock1: number = 0;
  productoModal(producto: Product){

    this.stock1 = 0;

    this.productoM = producto;

    this.stock1 = producto.stock + ( producto.returned || 0 ) + ( producto.bought || 0 ) - (producto.sold || 0) - ( producto.damaged || 0);
    
    if (this.stock1 === 0) {
      this.stock1 = 1;
    }
    
    this.stock = Array(this.stock1).fill(1).map((x,i)=>i);    

  }

  /** ================================================================
   *  AGREGAR AL CARRITO
  ==================================================================== */
  public carrito: Carrito[] = [];
  public local: any;
  agregarCarrito(product: Product, qty: any){

    let precio: number = product.price;
    if (this.login) {
      if (this.user.mayoreo) {
        precio = product.wholesale;        
      }
    }

    qty = Number(qty);

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
          price: precio
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
        price: precio
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
