import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from '../../service/ingresos.service';
import { catchError, EMPTY, finalize } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IngresoPersonal } from '../../interface/ingreso.interface';

// Interfaz para el objeto de solicitud
interface CedulaRequest {
  cedula: number;
}

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
  verificando = false;
  errorVerificacion = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroDialogComponent>,
    private snackBar: MatSnackBar,
    private readonly dialogservice: DialogService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.setupCedulaChangesListener();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(8)]],
      observacion: [{ value: null, disabled: true }]
    });
  }

  private setupCedulaChangesListener(): void {
    this.form.get('cedula')?.valueChanges.subscribe(value => {
      if (value && value.length >= 8) {
        this.verifyCedula(value);
      } else {
        this.resetObservacionField();
      }
    });
  }

  private verifyCedula(cedula: string): void {
    this.verificando = true;
    this.errorVerificacion = false;

    const request: CedulaRequest = { cedula: Number(cedula) };

    this.dialogservice.registerIngreso(request)
      .pipe(
        finalize(() => this.verificando = false),
        catchError(error => {
          console.error('Error verificando cédula:', error);
          this.errorVerificacion = true;
          this.showSnackBar('Error al verificar la cédula. Se permitirá el registro.');
          this.resetObservacionField();
          return EMPTY;
        })
      )
      .subscribe({
        next: (response: IngresoPersonal) => this.handleVerificationResponse(response),
        error: () => this.handleVerificationError()
      });
  }

  private handleVerificationResponse(response: IngresoPersonal): void {
    if (response?.asistencia?.ultima_salida?.tipo_salida === 'cita medica') {
      this.enableObservacionField('Esta cédula requiere observación por cita médica');
    } else {
      this.resetObservacionField();
      
      if (response?.message) {
        this.showSnackBar(response.message);
      }
    }
  }

  private handleVerificationError(): void {
    this.errorVerificacion = true;
    this.resetObservacionField();
    this.showSnackBar('Error al conectar con el servidor. Verifique su conexión.');
  }

  private enableObservacionField(message?: string): void {
    this.mostrarObservacion = true;
    const observacionControl = this.form.get('observacion');
    
    observacionControl?.enable();
    observacionControl?.setValidators([Validators.required]);
    observacionControl?.updateValueAndValidity();
    
    if (message) {
      this.showSnackBar(message);
    }
  }

  private resetObservacionField(): void {
    this.mostrarObservacion = false;
    const observacionControl = this.form.get('observacion');
    
    observacionControl?.disable();
    observacionControl?.clearValidators();
    observacionControl?.reset();
    observacionControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.get('cedula')?.invalid) {
      this.showSnackBar('Por favor, ingrese una cédula válida (mínimo 8 dígitos numéricos)');
      return;
    }

    if (this.mostrarObservacion && this.form.get('observacion')?.invalid) {
      this.showSnackBar('Por favor, ingrese la observación para la cita médica');
      return;
    }

    this.closeDialogWithResult();
  }

  private closeDialogWithResult(): void {
    const resultado = {
      cedula: Number(this.form.get('cedula')?.value),
      observacion: this.mostrarObservacion ? this.form.get('observacion')?.value : null,
      errorVerificacion: this.errorVerificacion
    };

    this.dialogRef.close(resultado);
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