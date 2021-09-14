import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, map, tap } from 'rxjs/operators'

// MODEL
import { Categoria } from '../models/categoria.model';

// INTERFACES
import { LoadCategoria } from '../interfaces/load-categoria.interface';

import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {

  public categoria!: Categoria;

  constructor(private http: HttpClient) { }

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
   *  LOAD Categoria
  ==================================================================== */
  loadCategoria(){

    return this.http.get<LoadCategoria>(`${base_url}/categorias`, this.headers)
        .pipe(
          map( resp =>{
            return resp;
          })
        );
        
  }

  /** ================================================================
   *  CREATE Categoria
  ==================================================================== */
  createCategoria(formData: any){
    
    return this.http.post(`${base_url}/categorias`, formData, this.headers);

  }

  /** ================================================================
   *  UPDATE Categoria
  ==================================================================== */
  updateCategoria(formData: any, id:string){
    
    return this.http.put(`${base_url}/categorias/${id}`, formData, this.headers);

  }



  // FIN DE LA CLASE
}



