import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DialogService } from '../../service/ingresos.service';
import { Dato, Empresas } from '../../interface/totalempresa';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { startWith } from 'rxjs';



interface TableOption {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule ,MatFormFieldModule, MatInputModule,MatDatepickerModule, MatButtonModule, MatNativeDateModule,
MatSelectModule , MatProgressSpinnerModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  empresasTotales: Dato[] = [];
  loading = false;
  error: string | null = null;



  dataSourcesfg: TableOption[] = [
    { value: 'asistencias', viewValue: 'Registro de Asistencia' },
  ];

  exportForm: FormGroup;
  
  constructor(private fb: FormBuilder , private readonly dialogService : DialogService) {
    this.exportForm = this.fb.group({
      dataSource: ["", Validators.required],
    
    });
  }

  ngOnInit(): void {
    this.empresas();
    this.exportForm.valueChanges.subscribe(() => {
      
    });
  }


  empresas(): void{

    this.loading = true;
    this.error = null;
    this.dialogService.obtenerEmpresa().pipe(
      startWith({ message: '', datos: [] as Dato[] })
    )
     .subscribe({
  
      next :(responde : Empresas) =>{
        if (responde && responde.datos) {
          this.empresasTotales = responde.datos;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    })
    



  }
  

}
