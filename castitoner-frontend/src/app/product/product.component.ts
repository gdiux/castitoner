import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

// SERVICES
import { ProductsService } from '../services/products.service';
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
  selector: 'app-product',
  templateUrl: './product.component.html',
  styles: [
  ]
})
export class ProductComponent implements OnInit {

  constructor(  private porductService: ProductsService,
                private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => {
      
      this.cargarProducto(id);
      
    });

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

}
