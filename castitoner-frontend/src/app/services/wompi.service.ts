import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

// ENVIRONMENT
import { environment } from '../../environments/environment';

// MODELS
import { User } from '../models/user.model';
import { Wompi } from '../models/wompi.model';

@Injectable({
  providedIn: 'root'
})
export class WompiService {

  constructor(  private http: HttpClient,
                private router: Router) { }



  // https://production.wompi.co/vi

  /** ================================================================
   *   CARGAR TRANSACCION DE WOMPI POR ID
  ==================================================================== */
  cargarTransaccionId( id: string){
    const endPoint = `https://production.wompi.co/v1/transactions`;
    return this.http.get<any>(`${endPoint}/${id}`)
            .pipe(
              map( (resp:{data: Wompi}) => {
                return resp.data;
              })
            );
  }


  // FIN DE LA CLASE
}
