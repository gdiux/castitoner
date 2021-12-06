import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, map, tap } from 'rxjs/operators'

// INTERFACES
import { LoadEmpresa } from '../interfaces/load-empresa.interface';

import { environment } from '../../environments/environment';
import { Datos } from '../models/empresa.model';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  public myEmpresa!: Datos;

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
   *   GET DATOS EMPRESA
  ==================================================================== */
  getDatos(){

    return this.http.get<LoadEmpresa>(`${base_url}/datos`, this.headers)
          .pipe(
            map( resp => {
              return resp;
            })
          );
  }

  // CLASS
}
