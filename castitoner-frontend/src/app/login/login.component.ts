import { Component, NgZone, OnInit } from '@angular/core';

// MODELS
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

import { environment } from '../../environments/environment';
const base_url = environment.base_url;

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})




export class LoginComponent implements OnInit {

  public user!: User;

  constructor(  private router: Router,
                private userService: UserService,
                private ngZone: NgZone) { }

  ngOnInit(): void {

    // GOOGLE
    
    if (!localStorage.getItem('token')) {
      this.login = false;
      this.renderButton();
      return;

    }else{
      this.login = true;
      this.router.navigateByUrl('/home')
    }

  }

  /** ================================================================
   *  INICIAR SESSION CON GOOGLE
  ==================================================================== */
  public auth2: any;
  public login: boolean = false;
  renderButton() {

    if (!this.login) {      
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
      });
  
      this.startApp();
    }


  }

  async startApp() {
    
    await this.userService.googleInit();
    this.auth2 = this.userService.auth2;

    this.attachSignin( document.getElementById('my-signin2') );
    
  };

  attachSignin(element:any) {
    
    this.auth2.attachClickHandler( element, {},
        (googleUser: any) => {
            const id_token = googleUser.getAuthResponse().id_token;
            this.userService.loginGoogle( id_token )
              .subscribe( resp => {
                
                

                  this.cargarUser();

                  let url:any = base_url;
                  if (localStorage.getItem('log')) {                  
                    url =  localStorage.getItem('log');
                  };

                  this.ngZone.run( () => {
                    window.location.href = url;
                  });

                
                

              });

        }, (error: any) => {
            alert(JSON.stringify(error, undefined, 2));
        });
  }

  /** ================================================================
   *  CARGAR USUARIO
  ==================================================================== */
  cargarUser(){

    if (!localStorage.getItem('token')) {
      this.login = false;
      return;

    }else{
      this.login = true;
      this.userService.validateToken()
      .subscribe( resp => {
        
        if (resp) {
          this.user = this.userService.user;          
          
        }else{

          localStorage.removeItem('token');
          window.location.reload();

        }
        

      });
    }

  }

}
