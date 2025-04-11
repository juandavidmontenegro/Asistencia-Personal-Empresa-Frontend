import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from '../../service/ingresos.service';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, from } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Asistencia, IngresoPersonal, RegistroRequest } from '../../interface/ingreso.interface';

// Interfaz para el objeto de solicitud


@Component({
  selector: 'app-registro-dialog',
  standalone: true,
  imports: [
  CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './modal.component.html',
})
export class RegistroDialogComponent implements OnInit {
  form!: FormGroup;
  mostrarObservacion = false;
  resulatadoIngreso ? :  IngresoPersonal;
  errorVerificacion = false;
  verificando = false;
  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroDialogComponent>,
    private snackBar: MatSnackBar,
    private readonly dialogservice: DialogService
  ) {}

  ngOnInit() {

  }
 

  private initializeForm(): void {
    this.form = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(8)]],
      observacion: [null]
    });
  }
  
   onCancel(): void {
     this.dialogRef.close();
   }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 6000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  
}