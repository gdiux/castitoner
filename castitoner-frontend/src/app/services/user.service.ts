import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

// ENVIRONMENT
import { environment } from '../../environments/environment';

// MODELS

import Swal from 'sweetalert2';

import { User } from '../models/user.model';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: User | undefined;
  public auth2: any;

  constructor(  private http: HttpClient,
                private router: Router ) {  
                  this.googleInit();
                }

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
   *   LOGOUT
  ==================================================================== */
  logout(){
    
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

  }

  /** ================================================================
   *   VALIDATE TOKEN OR RENEW TOKEN
  ==================================================================== */
  validateToken():Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        
        const { email, name, img, uid, status, cedula, phone, address, city, department, zip} = resp.usuario;

        this.user = new User( email, name, img, uid, status, cedula, phone, address, city, department, zip);        

        localStorage.setItem('token', resp.token);

      }),
      map( resp => true ),
      catchError( error => of(false) )
    );

  }

  /** ================================================================
   *   CREATE USER
  ==================================================================== */
  createUser( formData: any ){
      
    return this.http.post(`${base_url}/users`, formData, this.headers);

  }

  /** ================================================================
   *   UPDATE USER
  ==================================================================== */
  updateUser(formData: any, id: string){

    return this.http.put(`${base_url}/users/${id}`, formData, this.headers);

  } 

  /** ================================================================
   *  LOGIN
  ==================================================================== */
  googleInit() {

    return new Promise<void>( resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '251717913088-t59rpq55rfg87ls1vn6d9dcp5o3ublp1.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    })

  }

  loginGoogle( token: any ){
    
    return this.http.post(`${base_url}/login/google`, {token})
                      .pipe(
                        tap( (resp: any) => {
                          localStorage.setItem('token', resp.token);
                          console.log(resp.token);
                          
                        }),
                        catchError( error => of(false) )
                      );
  }

}
