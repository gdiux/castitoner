import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { delay, map, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';

// INTERFACES
import { LoadPedidos } from '../interfaces/load-pedidos.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(  private http: HttpClient) { }

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
   *  CREATE PEDIDOS
  ==================================================================== */
  createPedidos(formData: any){
    
    return this.http.post(`${base_url}/pedidos`, formData, this.headers);

  }

  /** ================================================================
   *   CARGAR PEDIDOS CLIENT
  ==================================================================== */
  cargarPedidosClient(desde: number = 0){
    const endPoint = `/pedidos/client?desde=${desde}`;
    return this.http.get<LoadPedidos>(`${base_url}${endPoint}`, this.headers)
            .pipe(
              map( resp => {
                return resp;
              })
            );
  }

}
