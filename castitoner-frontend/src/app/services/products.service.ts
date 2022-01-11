import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { delay, map, tap } from 'rxjs/operators';

// INTERFACES
import { LoadProduct, LoadCost, LoadProducts } from '../interfaces/load-products.interface';

// MODELS
import { Product } from '../models/product.model';

import { environment } from '../../environments/environment';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  
  public product: Product | undefined;

  constructor( private http: HttpClient ) { }

  /** ================================================================
   *   GET TOKEN
  ==================================================================== */
  get token():string {
    return localStorage.getItem('token') || '';
  }

  /** ================================================================
   *   GET HEADERS
  ==================================================================== */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /** ================================================================
   *   CARGAR PRODUCTOS
  ==================================================================== */
  cargarProductos(desde: number = 0){
    const endPoint = `/products?desde=${desde}&status=${false}`;
    return this.http.get<LoadProducts>(`${base_url}${endPoint}`, this.headers)
            .pipe(
              map( resp => {
                return resp;
              })
            );
  }

  /** ================================================================
   *   CARGAR COSTS PRODUCTOS
  ==================================================================== */
  cargarProductoCost(){
    const endPoint = `/products/cost/`;
    return this.http.get<LoadCost>(`${base_url}${endPoint}`, this.headers)
            .pipe(
              map( resp => {
                return resp;
              })
            );
  }

  /** ================================================================
   *   CARGAR PRODUCTOS POR ID
  ==================================================================== */
  cargarProductoId( id: string){
    const endPoint = `/products/${id}`;
    return this.http.get<LoadProduct>(`${base_url}${endPoint}`, this.headers)
            .pipe(
              map( resp => {
                return resp;
              })
            );
  }
  /** ================================================================
   *   CARGAR PRODUCTOS POR DEPARTAMENTO
  ==================================================================== */
  cargarProductoDepartamento( department: string ){
    const endPoint = `/products/department/${department}`;
    return this.http.get<LoadProducts>(`${base_url}${endPoint}`, this.headers)
                    .pipe(
                      map( resp => {
                        return resp;
                      })
                    );
  }

}
