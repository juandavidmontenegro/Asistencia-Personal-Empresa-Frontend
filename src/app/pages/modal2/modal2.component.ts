import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule, MatOptionModule, NativeDateAdapter } from '@angular/material/core';
import { TipoBoleta, } from '../../interface/dialog.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { __values } from 'tslib';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-modal2',
  standalone: true,
  imports: [
    CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatOptionModule, 
        MatDialogActions,
        MatDialogContent,
        MatSelectModule,
        MatDatepickerModule,
        MatDatepickerModule,
        MatNativeDateModule
  ],
  templateUrl: './modal2.component.html',
})
export class Modal2Component {
  form!: FormGroup;
  // aplicar la interfaz TipoBoleta
  boleta: TipoBoleta[] = [
    { value: 'compensatorio', viewValue: 'compensatorio' },
    { value: 'dia no remunerado', viewValue: 'dia no remunerado' },
    { value: 'cita medica', viewValue: 'cita medica' },
    { value: 'termino labor', viewValue: 'termino labor' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<Modal2Component>,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit() {
    this.form = this.fb.group({
      cedula: ['', [Validators.required, Validators.minLength(8)]],
      boleta: ['', [Validators.required]],
      fechaboleta : [null , Validators.required]
    });

    this.form.get('boleta')?.valueChanges.subscribe(__values =>{
      if (this.form.get('boleta')?.value === 'cita medica' && 'compensatorio' && 'dia no remunerado') {
        this.form.get('fechaboleta')?.setValidators([Validators.required]);
      } else {
        this.form.get('fechaboleta')?.clearValidators();
        this.form.get('fechaboleta')?.setValue(null);
      }
      this.form.get('fechaboleta')?.updateValueAndValidity();
    })

  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.snackBar.open('Por favor, ingrese una cédula válida (mínimo 8 dígitos numéricos)', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
    const cedulaValue = this.form.get('cedula')?.value;
    const tipoBoletaValue = this.form.get('boleta')?.value;
    const fechaValue = this.form.get('fechaboleta')?.value;
  
    if (isNaN(cedulaValue)) {
      this.snackBar.open('Error: La cédula debe ser un número válido', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
    const data = {
      cedula: cedulaValue,
      boleta: tipoBoletaValue,
      fechaboleta: fechaValue
    };
    this.dialogRef.close(data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}