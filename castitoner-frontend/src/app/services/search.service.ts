import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { delay, map } from 'rxjs/operators';

// INTERFACES
import { LoadProducts } from '../interfaces/load-products.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(  private http: HttpClient) { }


  /** ================================================================
   *   SEARCH
  ==================================================================== */
  search( tipo: string, termino: string, desde: number = 0, hasta: number = 10 ){

  const endPoint = `/search/query/${tipo}/${termino}?desde=${desde}&hasta=${hasta}`;
  return this.http.get<LoadProducts>(`${base_url}${endPoint}`)
          .pipe(
            map( (resp: any) => {              
              return resp;
            })
          );
  }


}
