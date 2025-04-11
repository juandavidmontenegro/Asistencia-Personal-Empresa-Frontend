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
    this.initializeForm();
    this.setupCedulaValidation();

  }
  private setupCedulaValidation(): void {
    this.form.get('cedula')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value && value.length >= 8) {
        this.verificarCedula(value);
      } else {
        this.resetObservacion();
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(8)]],
      observacion: [null]
    });
  }
  
  onSubmit() {
    if (this.form.invalid) {
      this.showSnackBar('Por favor, complete todos los campos requeridos');
      return;
    }
  
    const cedulaValue = this.form.get('cedula')?.value;
    const observacionValue = this.form.get('observacion')?.value;
    const datosRegistro : RegistroRequest = {
        cedula: cedulaValue,
        observacion: this.mostrarObservacion ? observacionValue : undefined,
    };
    this.dialogservice.registerIngreso(datosRegistro)
      .pipe(
        catchError(err => {
          console.error('Error al registrar:', err);
          this.errorVerificacion = true;
          this.showSnackBar(err.error?.message || 'Ocurrió un error al registrar el ingreso');
          return EMPTY;
        })
      )
      .subscribe({
        next: (response : IngresoPersonal) => {
          this.resulatadoIngreso = response;
          this.showSnackBar('Registro exitoso');
          this.form.reset();
          this.mostrarObservacion = false;
          this.dialogRef.close(response);
        },
        error: (err) => {
          this.errorVerificacion = true;
          this.resulatadoIngreso = undefined;
          this.showSnackBar(err.error?.message || 'Ocurrió un error al registrar el ingreso');
        }
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
  private verificarCedula(cedula: string): void {
    this.verificando = true;
    this.errorVerificacion = false;

    const datosVerificacion: RegistroRequest = {
      cedula,
      observacion: this.mostrarObservacion ? this.form.get('observacion')?.value : null
    };

    this.dialogservice.registerIngreso(datosVerificacion)
      .pipe(
        finalize(() => this.verificando = false)
      )
      .subscribe({
        next: (response: IngresoPersonal) => {
          if (response?.asistencia?.ultima_salida?.tipo_salida === 'cita medica') {
            this.habilitarObservacion();
            this.showSnackBar('Esta cédula requiere observación por cita médica');
          } else {
            this.resetObservacion();
          }
        },
        error: (error) => {
          console.error('Error al verificar cédula:', error);
          this.errorVerificacion = true;
          this.resetObservacion();
          this.showSnackBar('Error al verificar la cédula');
        }
      });
  }
  private habilitarObservacion(): void {
    this.mostrarObservacion = true;
    const observacionControl = this.form.get('observacion');
    if (observacionControl) {
      observacionControl.enable();
      observacionControl.setValidators([Validators.required]);
      observacionControl.updateValueAndValidity();
    }
  }

  private resetObservacion(): void {
    this.mostrarObservacion = false;
    const observacionControl = this.form.get('observacion');
    if (observacionControl) {
      observacionControl.disable();
      observacionControl.clearValidators();
      observacionControl.setValue(null);
      observacionControl.updateValueAndValidity();
    }
  }
}