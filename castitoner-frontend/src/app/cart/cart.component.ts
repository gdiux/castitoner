import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { PedidosService } from '../services/pedidos.service';

// MODELS
import { Carrito } from '../models/carrito.model';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import Swal from 'sweetalert2';

declare const gapi:any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [
  ]
})
export class CartComponent implements OnInit {

  constructor(  private userService: UserService,
                private fb: FormBuilder,
                private pedidosService: PedidosService) { }

  public login:boolean = false;
  public user!: User;

  ngOnInit(): void {

    this.cargarUser();    

    // RENDERIZAR BOTON DE GOOGLE
    // this.renderButton();

    if ( localStorage.getItem('token') ) {
      this.login = true;      
    }
    
  }

  /** ================================================================
   *  CARGAR USUARIO
  ==================================================================== */
  cargarUser(){

    if (!localStorage.getItem('token')) {
      this.login = false;
      this.verCarrito();
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

        this.verCarrito();
        
      });
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

                this.cargarUser();
                
                window.location.reload();
                

              });

        }, (error: any) => {
            alert(JSON.stringify(error, undefined, 2));
        });
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

      this.actualizarForm();

    }

  }

  /** ================================================================
   *   ACTUALIZAR FORMULARIO
  ==================================================================== */
  actualizarForm(){

    this.pedidoForm.setValue({
      name: this.user.name || '',
      telefono: this.user.phone || '',
      email: this.user.email || '',
      cedula: this.user.cedula || '',
      direccion: this.user.address || '',
      ciudad: this.user.city || '',
      departamento: this.user.department || '',
      comentario: '',
      products: this.carrito,
      amount: this.total
      
    });

  }
  /** ================================================================
   *   CREAR PEDIDO
  ==================================================================== */
  public formSubmitted:boolean = false;
  public pedidoForm = this.fb.group({
    name: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    email: ['', [Validators.required]],
    cedula: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    comentario: [''],
    products: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(1)]]
  });

  crearPedido(){    
    
    this.formSubmitted = true;    
    
    if (this.pedidoForm.invalid) {
      Swal.fire('Atención', 'Debes de llenar todos los campos y debes de tener minimo 1 producto en el carrito', 'info')
      return;
    }
    
    this.pedidosService.createPedidos(this.pedidoForm.value)
        .subscribe( (resp) => {
          
          this.formSubmitted = false;
          this.total = 0;          
          this.carrito = [];
          localStorage.removeItem('carrito');

          this.actualizarForm();

          Swal.fire('Estupendo', 'Se ha creado la mesa exitosamente', 'success');
          
        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });
  }
  
  /** ================================================================
   *   VALIDAR CAMPOS
  ==================================================================== */
  // campoValido(campo: string): boolean{

  //   if ( this.pedidoForm.get(campo).invalid &&  this.formSubmitted) {      
  //     return true;      
  //   } else{      
  //     return false;
  //   }

  // }


}
