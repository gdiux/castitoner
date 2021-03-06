import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import {UUID} from 'uuid-generator-ts';

// SERVICES
import { PedidosService } from '../services/pedidos.service';
import { WompiService } from '../services/wompi.service';
import { UserService } from '../services/user.service';

// MODELS
import { Carrito } from '../models/carrito.model';
import { User } from '../models/user.model';

import { environment } from '../../environments/environment';
import { Wompi } from '../models/wompi.model';



declare const gapi:any;

@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styles: [
  ]
})
export class ValidarComponent implements OnInit {

  public url!:string;

  constructor(  private userService: UserService,
                private fb: FormBuilder,
                private pedidosService: PedidosService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private elementRef:ElementRef,
                private wompiService: WompiService) { 
                  this.url = environment.local_url;
                }

  public login:boolean = false;
  public user!: User;
              

  ngOnInit(): void {

    // CARGAR USUARIOS
    this.cargarUser();    

    // RENDERIZAR BOTON DE GOOGLE
    // this.renderButton();

    if ( localStorage.getItem('token') ) {
      this.login = true;      
    }

    this.uuid = new UUID();

  }

  /** ================================================================
   *  WOMPI
  ==================================================================== */
  public uuid!: any;
  public transaction: boolean = false;
  public referencia!:string;
  public transaccion: string = '0';
  wompi(){

    if (this.total === 0) {

      Swal.fire('Atención', 'No tienes ningun producto seleccionado', 'info');
      return;
      
    }
    
    // SI NO ESTA APROBADO
    if (!this.transaction) {
      let s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "https://checkout.wompi.co/widget.js";
      s.setAttribute('data-render', 'button');
      s.setAttribute('data-public-key', 'pub_prod_6mVGKjbJuRpL2SLeN9e8D41Z12sqAoGI');
      s.setAttribute('data-currency', 'COP');
      s.setAttribute('data-redirect-url', `${this.url}/cart/${this.uuid.getDashFreeUUID()}`);
      s.setAttribute('data-amount-in-cents', `${String(this.total)}00`);
      s.setAttribute('data-reference', this.uuid.getDashFreeUUID());
  
      this.elementRef.nativeElement.appendChild(s);
    }


  }

  /** ================================================================
   *  CARGAR TRANSACCION DE WOMPI ID
  ==================================================================== */
  public estado: string = '';
  public data!:Wompi;
  cargarTransaccion(id:string){

    if (!this.transaction) {   

    this.wompiService.cargarTransaccionId(this.transaccion)
        .subscribe( data => {             

          if (data.reference !== this.referencia) {
            Swal.fire('Atención', 'La referencia no coincide con el numero de transacción', 'warning');
            this.router.navigateByUrl('/pedidos');
            return;
          }   
          
          this.transaction = true;
          this.data = data;
          this.crearPedido();
          

        }, (err) => { 
          Swal.fire('Error', err.error.error.reason, 'error');
          this.router.navigateByUrl('/pedidos');
        });
    }
  }

  /** ================================================================
   *  CARGAR USUARIO
  ==================================================================== */
  public updateInfo: boolean = false;
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

          // OBTENER TRANSACCION
          this.activatedRoute.queryParams.subscribe( ({id}) => {
            
            this.transaccion = id;
            if (this.transaccion) {        
              this.cargarTransaccion(id);

              // OBTENER REFERENCIA
              this.activatedRoute.params.subscribe(({referencia}) => {          
                this.referencia = referencia;
              });
            }

          });
          
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

    this.wompi();

  }

  /** ================================================================
   *   ACTUALIZAR FORMULARIO
  ==================================================================== */
  actualizarForm(){
      
      this.pedidoForm.reset({
        name: this.user.name || '',
        telefono: this.user.phone || '',
        email: this.user.email || '',
        cedula: this.user.cedula || '',
        direccion: this.user.address || '',
        ciudad: this.user.city || '',
        departamento: this.user.department || '',
        comentario: '',
        products: this.carrito,
        amount: this.total,
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
    amount: ['', [Validators.required, Validators.min(1)]],
    paystatus: [''],
    referencia: [''],
    transaccion: [''],
    status: [true]
  });

  crearPedido(){    
    
    this.formSubmitted = true;    
    
    if (this.pedidoForm.invalid) {
      Swal.fire('Atención', 'Debes de llenar todos los campos y debes de tener minimo 1 producto en el carrito', 'info')
      return;
    }

    this.pedidoForm.value.paystatus = this.data.status;
    this.pedidoForm.value.referencia = this.referencia;
    this.pedidoForm.value.transaccion = this.transaccion;
    this.pedidoForm.value.status = true;

    if (this.data.status !== 'APPROVED') {
      this.pedidoForm.value.status = false;
    }    
    
    this.pedidosService.createPedidos(this.pedidoForm.value)
        .subscribe( (resp) => {
          
          this.formSubmitted = false;
          this.total = 0;          
          this.carrito = [];
          localStorage.removeItem('carrito');

          this.actualizarForm();

          Swal.fire('Estupendo', 'Se ha creado la mesa exitosamente', 'success');

          this.router.navigateByUrl('/pedidos');
          
        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });
  }

  // FIN DE LA CLASE

}
