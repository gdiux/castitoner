import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// SERIVES
import { SearchService } from '../services/search.service';
import { DepartmentService } from '../services/department.service';
import { UserService } from '../services/user.service';

// MODELS
import { Product } from '../models/product.model';
import { Department } from '../models/department.model';
import { Carrito } from '../models/carrito.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})

export class SearchComponent implements OnInit {

  public desde: number = 0;
  public hasta: number = 10;
  public tipo: string = '';
  public termino: string = '';

    
  constructor(  private router: Router,
                private activatedRoute: ActivatedRoute,
                private searchService: SearchService,
                private departmentService: DepartmentService,
                private userService: UserService) { }
    
  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({tipo, termino}) => {

      this.tipo = tipo;
      this.termino = termino;
      
      this.buscador();
      
    });

    this.cargarDepartamento();
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
   *   BUSCAR
  ==================================================================== */
  public productos: Product[] = [];
  public total: number = 0;

  public btnAtras: string = 'false';
  public btnAdelante: string = 'true';

  buscador(){

    this.searchService.search(this.tipo, this.termino, this.desde, this.hasta)
        .subscribe( ({resultados}) => {
          
          this.productos = resultados;
          this.total = resultados.length;
          
        });


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
   *  CAMBIAR PAGINA
  ==================================================================== */
  cambiarPagina(valor: number){

    this.desde += valor;    

    if (this.desde < 0) {
      this.desde = 0;
    }
    this.buscador();

  }

  /** ================================================================
   *  CARGAR DEPARTAMENTOS
  ==================================================================== */
  public departamentos: Department[] = [];
  cargarDepartamento(){

    this.departmentService.loadDepartment( this.desde, this.hasta )
        .subscribe(({ total, departments }) =>{

          this.departamentos = departments;

        }, (err) => {  }
        
        )

  }

  /** ================================================================
   *  AGREGAR AL CARRITO
  ==================================================================== */
  public carrito: Carrito[] = [];
  public local: any;
  agregarCarrito(product: Product, qty: any ){

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
