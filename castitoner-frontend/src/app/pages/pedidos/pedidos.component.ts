import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// SERVICES
import { UserService } from '../../services/user.service';
import { PedidosService } from 'src/app/services/pedidos.service';

// MODELS
import { User } from '../../models/user.model';
import { Pedido } from 'src/app/models/pedido.model';
import { Carrito } from '../../models/carrito.model';
import { Product } from '../../models/product.model';
import { LoadProduct } from '../../interfaces/load-products.interface';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styles: [
  ]
})
export class PedidosComponent implements OnInit {

  public user!: User;

  constructor(  private userService: UserService,
                private router: Router,
                private pedidosService: PedidosService) {

    this.user = userService.user;

  }

  ngOnInit(): void {

    // CARGAR PEDIDOS
    this.cargarPedidos();
    
  }

  /** ================================================================
   *   CARGAR PEDIDOS
  ==================================================================== */
  public listaPedidos: Pedido[] = [];
  public totalPedidos: number = 0;
  public total: number = 0;
  public hasta: number = 50;
  

  cargarPedidos(){

    this.pedidosService.cargarPedidosClient(this.desde)
        .subscribe( ({pedidos, total}) => {

          this.listaPedidos = pedidos;
          this.total = pedidos.length;
          this.totalPedidos = total;      

        });

  }

  /** ================================================================
   *   DETALLES DEL PEDIDO
  ==================================================================== */
  public carrito: Carrito[] = [];
  public pedidoD!: Pedido;
  public amountP: number = 0;
  detallesPedido( pedido: Pedido ){

    this.pedidoD = pedido;
    this.carrito = pedido.products;
    this.amountP = pedido.amount;

  }

  /** ================================================================
   *  CAMBIAR PAGINA
  ==================================================================== */
  public desde:number = 0;
  cambiarPagina(valor: number){

    this.desde += valor;    

    if (this.desde < 0) {
      this.desde = 0;
    }
    this.cargarPedidos();

  }
  

}
