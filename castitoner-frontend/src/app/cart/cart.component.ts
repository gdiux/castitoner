import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [
  ]
})
export class CartComponent implements OnInit {

  public url!:string;
  public login:boolean = false;
  public confirmacion:boolean = false;
  public user!: User;

  constructor(  private userService: UserService,
                private fb: FormBuilder,
                private pedidosService: PedidosService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private elementRef:ElementRef,
                private wompiService: WompiService) {

                  this.user = userService.user;
                  
                }

  

  ngOnInit(): void {

    this.url = environment.local_url;
    
    this.verCarrito();
    this.cargarUser();
    
    // this.wompi(); 

  }

  /** ================================================================
   *   LOGIN
  ==================================================================== */
  log(){
    localStorage.setItem('log', window.location.href);   

  }

  /** ================================================================
   *   ACTUALIZAR USUARIO
  ==================================================================== */
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
  
          this.upUserForm.reset({  
            name: this.user.name || '',
            phone: this.user.phone || '',
            email: this.user.email || '',
            cedula: this.user.cedula || '',
            address: this.user.address || '',
            city: this.user.city || '',
            department: this.user.department || '',
            valid: this.user.valid
            
          });
          // CONFIRMAR SI EL CLIENTE YA ACTUALIZO SUS DATOS
      
      
          if (this.user.valid === true) {        
            this.user.valid = true;
          }else{
            this.user.valid = false;        
          }
          this.confirmacion = this.user.valid; 
          
        }else{

          localStorage.removeItem('token');
          window.location.reload();

        }
        

      });
    }

  }
  /** ================================================================
   *   ACTUALIZAR USUARIO
  ==================================================================== */
  public Ped: boolean = false;
  public upUserForm = this.fb.group({

    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    cedula: ['', [Validators.required]],
    email: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: [''],
    department: [''],
    valid: [false]

  });

  actualizarUsuario(){

    this.Ped = true;

    this.upUserForm.value.email = this.user.email;    

    if (this.upUserForm.invalid) {
      Swal.fire('Atencion', 'Debes de llenar todos los campos', 'info');  
      return;
    }

    this.upUserForm.value.valid = true;
    this.userService.updateUser(this.upUserForm.value, this.user.cid)
        .subscribe( resp =>  {     
          
          console.log(resp);
          
          
          Swal.fire('Estupendo', 'Se ha confirmado los datos exitosamente', 'success');
          this.user.valid = true;
          this.confirmacion = true;

          window.location.reload();

          // this.wompi();

        }, (err) =>{ Swal.fire('Error', err.error.msg, 'error') });
  }

  /** ================================================================
   *   VALIDAR CAMPOS
  ==================================================================== */
  campoValido(campo: string): boolean{

    if ( this.upUserForm.get(campo)?.invalid &&  this.Ped) {      
      return true;      
    } else{      
      return false;
    }

  }

  /** ================================================================
   *  WOMPI
  ==================================================================== */
  public uuid!: any;
  public transaction: boolean = false;
  public referencia!:string;
  public transaccion: string = '0';

  pagoWompi(){

    this.uuid = new UUID();

    if (this.confirmacion ) {

      window.open(`https://checkout.wompi.co/p/?public-key=pub_prod_6mVGKjbJuRpL2SLeN9e8D41Z12sqAoGI&currency=COP&amount-in-cents=${String(this.total)}00&reference=${this.uuid.getDashFreeUUID()}&redirect-url=${this.url}/validar/${this.uuid.getDashFreeUUID()}`, "_blank");

      this.router.navigateByUrl('/pedidos');

    }else{

      Swal.fire('Atención', 'Debes de actualizar su dirección para completar el pago', 'info');

    }


  }


  /** ================================================================
   *  WOMPI
  ==================================================================== */

  wompi(){

    // SI NO ESTA APROBADO
    this.uuid = new UUID();
    
    if (this.confirmacion ) {
      
      let s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "https://checkout.wompi.co/widget.js";
      s.setAttribute('data-render', 'button');
      s.setAttribute('data-public-key', 'pub_prod_6mVGKjbJuRpL2SLeN9e8D41Z12sqAoGI');
      s.setAttribute('data-currency', 'COP');
      s.setAttribute('data-redirect-url', `${this.url}/validar/${this.uuid.getDashFreeUUID()}`);
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
          

        }, (err) => { 
          Swal.fire('Error', err.error.error.reason, 'error');
          this.router.navigateByUrl('/pedidos');
        });
    }
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
      
    this.pedidoForm.reset({
      name: this.user?.name || '',
      telefono: this.user?.phone || '',
      email: this.user?.email || '',
      cedula: this.user?.cedula || '',
      direccion: this.user?.address || '',
      ciudad: this.user?.city || '',
      departamento: this.user?.department || '',
      comentario: '',
      products: this.carrito,
      amount: this.total,
    });

}

  /** ================================================================
   *   CREAR PEDIDO
  ==================================================================== */
  public formSubmittedPed:boolean = false;
  public comentarios!: string;

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

    this.verCarrito();
    
    this.Ped = true;
    this.uuid = new UUID();
    
    if (this.pedidoForm.invalid) {
      Swal.fire('Atención', 'Debes de llenar todos los campos y debes de tener minimo 1 producto en el carrito', 'info');
      
      return;
    }

    this.pedidoForm.value.paystatus = 'PENDENT';
    this.pedidoForm.value.referencia = this.uuid.getDashFreeUUID();
    this.pedidoForm.value.transaccion = this.uuid.getDashFreeUUID();
    this.pedidoForm.value.status = true;
    this.pedidoForm.value.comentario = this.comentarios;
    
    this.pedidosService.createPedidos(this.pedidoForm.value)
        .subscribe( (resp) => {
          
          this.Ped = false;
          this.total = 0;          
          this.carrito = [];
          localStorage.removeItem('carrito');

          this.actualizarForm();

          Swal.fire('Estupendo', 'Se ha creado el pedido exitosamente', 'success');

          this.router.navigateByUrl('/pedidos');
          
        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });
  }
 

  // FIN DE LA CLASE
}
