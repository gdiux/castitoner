import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// SERVICES
import { UserService } from '../../services/user.service';
import { PedidosService } from 'src/app/services/pedidos.service';

// MODELS
import { User } from '../../models/user.model';
import { Pedido } from 'src/app/models/pedido.model';
import { Carrito } from '../../models/carrito.model';
import { Product } from '../../models/product.model';
import { LoadProduct } from '../../interfaces/load-products.interface';
import { Datos } from '../../models/empresa.model';
import { EmpresaService } from '../../services/empresa.service';
import Swal from 'sweetalert2';

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
                private pedidosService: PedidosService,
                private empresaService: EmpresaService) {

    this.user = userService.user;

  }

  ngOnInit(): void {

    // CARGAR PEDIDOS
    this.cargarPedidos();

    // CARGAR DATOS
    this.cargarDatos();
    
  }

  /** ================================================================
   *   CARGAR DATOS DE LA EMPRESA
  ==================================================================== */
  public empresa!: Datos;
  cargarDatos(){

    this.empresaService.getDatos()
        .subscribe( datos => {
          this.empresa = datos.datos;

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });
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

  /** ================================================================
   *  PDF
  ==================================================================== */
  downloadPDF() {
    // Extraemos el
    const DATA = document.getElementById('htmlData') as HTMLElement;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas( DATA , options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    });
  }


  // FIN DE LA CLASE
}
