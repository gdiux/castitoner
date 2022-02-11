import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Department } from 'src/app/models/department.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// MODELS
import { Categoria } from '../../models/categoria.model';
import { Carrito } from '../../models/carrito.model';
import { User } from 'src/app/models/user.model';

// SERVICES
import { DepartmentService } from '../../services/department.service';
import { CarritoService } from '../../services/carrito.service';
import { UserService } from '../../services/user.service';
import { CategoriaService } from '../../services/categorias.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public user!: User;
  
  constructor(  private departmentService: DepartmentService,
                private router: Router,
                private carritoService: CarritoService,
                private userService: UserService,
                private categoriaService: CategoriaService) {


                }

  ngOnInit(): void {

    // CARGAR USUARIO
    this.cargarUser();

    // CARGAR CATEGORIAS
    this.cargarCategorias();
    
    // CARGAR DEPARTAMENTOS
    this.cargarDepartamento();
    
  }

  /** ================================================================
   *   LOGIN
  ==================================================================== */
  log(){
    localStorage.setItem('log', window.location.href);   

  }

  /** ================================================================
   *  CARGAR USUARIO
  ==================================================================== */
  public login: boolean = false;
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
   *  CARGAR CATEGORIAS
  ==================================================================== */
  public categorias: Categoria[] = [];
  cargarCategorias(){

    this.categoriaService.loadCategoria()
        .subscribe(({ total, categorias }) =>{

          this.categorias = categorias;          

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); }
        
        )

  }

  /** ================================================================
   *  CARGAR DEPARTAMENTOS
  ==================================================================== */
  public departamentos: Department[] = [];
  cargarDepartamento(){

    this.departmentService.loadDepartment()
        .subscribe(({ total, departments }) =>{

          this.departamentos = departments;

        }, (err) => {  }
        
        )

  }

  /** ================================================================
   *  BUSCAR PRODUCTOS
  ==================================================================== */
  // @ViewChild('navbarCollapse') navbarCollapse: ElementRef | undefined;
  buscarProductos(termino:string){

    if (termino.length === 0) {
      return;
    }

    // CERRAR MENU
    this.cerrarMenu();    

    // INGRESAR
    this.router.navigateByUrl(`/search/producto/${termino}`);

  }

  /** ================================================================
   *  CERRAR MENU
  ==================================================================== */
  cerrarMenu(){
    let navbar = document.getElementById("navbarCollapse");
    navbar?.classList.remove('show');
  }

  /** ================================================================
   *  MOSTRAR CARRITO PRODUCTOS
  ==================================================================== */
  public carrito: Carrito[] = [];
  public local: any;
  verCarrito(){

    // CARRITO LOCAL
    if (localStorage.getItem('carrito')) {
      this.local = localStorage.getItem('carrito');
      this.carrito = JSON.parse(this.local);
    }else{
      this.carrito = [];
    }
    
    this.sumarTotales();

  }

  /** ================================================================
   *  ELIMINAR PRODUCTOS DEL CARRITO
  ==================================================================== */
  eliminarProductoCarrito( i: number ){

    this.carrito.splice(i, 1);

    localStorage.setItem('carrito', JSON.stringify(this.carrito));

    this.verCarrito();

  }

  /** ================================================================
   *  SUMAR PRODUCTOS DEL CARRITO
  ==================================================================== */
  public total:number = 0;
  sumarTotales(){
    
    this.total = 0;
    if (this.carrito.length > 0) {
      
      for (let i = 0; i < this.carrito.length; i++) {
        
        this.total += Number(this.carrito[i].price )* Number(this.carrito[i].qty);
        
      }
      
    }

  }
  
  // /** ================================================================
  //  *  INICIAR SESSION CON GOOGLE
  // ==================================================================== */
  // public auth2: any;
  // renderButton() {

  //   if (!this.login) {      
  //     gapi.signin2.render('my-signin2', {
  //       'scope': 'profile email',
  //       'width': 40,
  //       'height': 40,
  //       'longtitle': true,
  //       'theme': 'dark',
  //     });
  
  //     this.startApp();
  //   }


  // }

  // async startApp() {
    
  //   await this.userService.googleInit();
  //   this.auth2 = this.userService.auth2;

  //   this.attachSignin( document.getElementById('my-signin2') );
    
  // };

  // attachSignin(element:any) {
    
  //   this.auth2.attachClickHandler( element, {},
  //       (googleUser: any) => {
  //           const id_token = googleUser.getAuthResponse().id_token;
  //           this.userService.loginGoogle( id_token )
  //             .subscribe( resp => {
                

  //               this.cargarUser();
                
  //               window.location.reload();

  //             });

  //       }, (error: any) => {
  //           alert(JSON.stringify(error, undefined, 2));
  //       });
  // }

  /** ================================================================
   *  LOGOUT
  ==================================================================== */
  logout(){

    localStorage.removeItem('token');
    window.location.reload();

  }

}
