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
    { value: 'empleados', viewValue: 'Tabla de Empleados' },
    { value: 'asistencias', viewValue: 'Registro de Asistencias' },
    { value: 'permisos', viewValue: 'Registro de Permisos' },
    { value: 'visitantes', viewValue: 'Registro de Visitantes' }
  ];



  exportForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.exportForm = this.fb.group({
      dataSource: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      fileName: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")]],
      format: ["xlsx"],
    }, { validator: this.dateRangeValidator });
  }

  ngOnInit(): void {
    this.exportForm.valueChanges.subscribe(() => {
    });
  }

  dateRangeValidator(group: FormGroup) {
    const start = group.get("startDate")?.value;
    const end = group.get("endDate")?.value;
    if (start && end && new Date(start) > new Date(end)) {
      return { dateRange: true };
    }
    return null;
  }

}
