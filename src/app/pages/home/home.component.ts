import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TotalPerson } from '../../interface/attentends.interface';

interface TableOption {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule 
  , MatFormFieldModule, MatInputModule, 
    MatDatepickerModule, MatButtonModule , MatNativeDateModule , MatSelectModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  dataSourcesfg: TableOption[] = [
    { value: 'asistencias', viewValue: 'Registro de Asistencia' },
  ];

  exportForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.exportForm = this.fb.group({
      dataSource: ["", Validators.required],
    
    });
  }

  ngOnInit(): void {
    this.exportForm.valueChanges.subscribe(() => {
    });
  }

  

}
