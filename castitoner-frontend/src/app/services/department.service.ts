import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { delay, map, tap } from 'rxjs/operators'

// MODEL
import { Department } from '../models/department.model';

// INTERFACES
import { LoadDepartment } from '../interfaces/load-department.interface';

import { environment } from '../../environments/environment';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class DepartmentService {

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
        'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MDVlM2E5ZWU1OGE4ODIxZGNlNmIxNTkiLCJpYXQiOjE2MjQwMTc1OTUsImV4cCI6MTYyNDAzMTk5NX0.Mui0XE0Y0ThL0FadeZo3bKEyr_IYJykpULTcwoW9eYI'
      }
    }
  }

  /** ================================================================
   *  LOAD DEPARTMENT
  ==================================================================== */
  loadDepartment(desde:number = 0, hasta: number = 10){

    return this.http.get<LoadDepartment>(`${base_url}/departments?desde=${desde}&hasta=${hasta}`, this.headers)
        .pipe(
          map( resp =>{
            return resp;
          })
        );
        
  }

}
