import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { delay, map, tap } from 'rxjs/operators';
import { Carrito } from '../models/carrito.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  public carrito: Carrito[] = [];

  constructor( ) { }

  /** ================================================================
   *  GET CARRITO
  ==================================================================== */
  upCarrito(carrito: Carrito[]){

    this.carrito = carrito;

  }

}
