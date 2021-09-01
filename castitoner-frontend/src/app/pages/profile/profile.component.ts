import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// SERVICE
import { UserService } from '../../services/user.service';

// MODELS
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  public user!: User;

  constructor(  private userService: UserService,
                private fb: FormBuilder) { 

    this.user = userService.user;    

    this.upUserForm.reset({

      name: this.user.name || '',
      phone: this.user.phone || '',
      email: this.user.email || '',
      cedula: this.user.cedula || '',
      address: this.user.address || '',
      city: this.user.city || '',
      department: this.user.department || '',
      valid: this.user.valid

    });    

  }

  ngOnInit(): void {
  }

  /** ================================================================
   *   ACTUALIZAR USUARIO
  ==================================================================== */
  public formSubmitted: boolean = false;
  public upUserForm = this.fb.group({

    name: ['', [Validators.required, Validators.maxLength(3)]],
    cedula: ['', [Validators.required]],
    phone: [''],
    email: ['', [Validators.required]],
    address: [''],
    city: [''],
    department: [''],
    valid: [false]

  });

  actualizarUsuario(){
    
    this.userService.updateUser(this.upUserForm.value, this.user.cid)
        .subscribe( resp =>  {          
          
          Swal.fire('Estupendo', 'Se ha actualizado tu perfil exitosamente', 'success');

        }, (err) =>{ Swal.fire('Error', err.error.msg, 'error') });
        
  }

}
