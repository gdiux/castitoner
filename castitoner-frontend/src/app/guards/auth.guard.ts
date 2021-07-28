import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

// SERVICES
import { UserService } from '../services/user.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(  private userService: UserService,
                private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

      return this.userService.validateToken()
                  .pipe(
                    tap( autenticado => {
                      console.log('autenticado', autenticado);                      

                      if (!autenticado) {
                        this.router.navigateByUrl('/');
                      }

                    })
                  );

    
  }
  
}
