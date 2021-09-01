import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/models/department.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// SERVICES
import { DepartmentService } from '../../services/department.service';
import { CarritoService } from '../../services/carrito.service';
import { Carrito } from '../../models/carrito.model';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user.model';

declare const gapi:any;

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
                private userService: UserService) {


                }

  ngOnInit(): void {

    // CARGAR USUARIO
    this.cargarUser();

    // CARGAR DEPARTAMENTOS
    this.cargarDepartamento();

    // RENDERIZAR BOTON DE GOOGLE
    this.renderButton();
    
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
  buscarProductos(termino:string){

    if (termino.length === 0) {
      return;
    }

    // INGRESAR
    this.router.navigateByUrl(`/search/producto/${termino}`);

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
  
  /** ================================================================
   *  INICIAR SESSION CON GOOGLE
  ==================================================================== */
  public auth2: any;
  renderButton() {

    if (!this.login) {      
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 40,
        'height': 40,
        'longtitle': true,
        'theme': 'dark',
      });
  
      this.startApp();
    }


  }

  async startApp() {
    
    await this.userService.googleInit();
    this.auth2 = this.userService.auth2;

    this.attachSignin( document.getElementById('my-signin2') );
    
  };

  attachSignin(element:any) {
    
    this.auth2.attachClickHandler( element, {},
        (googleUser: any) => {
            const id_token = googleUser.getAuthResponse().id_token;
            this.userService.loginGoogle( id_token )
              .subscribe( resp => {

                console.log(resp);
                

                this.cargarUser();
                
                window.location.reload();

              });

        }, (error: any) => {
            alert(JSON.stringify(error, undefined, 2));
        });
  }

  /** ================================================================
   *  LOGOUT
  ==================================================================== */
  logout(){

    localStorage.removeItem('token');
    window.location.reload();

  }

}
