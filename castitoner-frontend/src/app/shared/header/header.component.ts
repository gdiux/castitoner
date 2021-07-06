import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/models/department.model';
import Swal from 'sweetalert2';

// SERVICES
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  constructor(private departmentService: DepartmentService) { }

  ngOnInit(): void {

    // CARGAR DEPARTAMENTOS
    this.cargarDepartamento();

  }

  /** ================================================================
   *  CARGAR DEPARTAMENTOS
  ==================================================================== */
  public departamentos: Department[] = [];


  cargarDepartamento(){

    this.departmentService.loadDepartment()
        .subscribe(({ total, departments }) =>{

          this.departamentos = departments;

        }, (err) => {  }
        
        )

  }

}
