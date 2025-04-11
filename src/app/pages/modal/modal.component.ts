import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from '../../service/ingresos.service';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Asistencia, IngresoPersonal, RegistroRequest } from '../../interface/ingreso.interface';

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
  resultadoIngreso!: IngresoPersonal;
  errorVerificacion = false;
  verificando = false;
  tipoSalida = '';
  requiereObservacion = false;

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

  private initializeForm(): void {
    this.form = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(8)]],
      observacion: [null]
    });
  }

  private setupCedulaValidation(): void {
    this.form.get('cedula')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(cedula => {
        if (cedula && this.form.get('cedula')?.valid) {
          this.verificarCedula(cedula);
        } else {
          this.resetFormState();
        }
      });
  }

  private resetFormState(): void {
    this.mostrarObservacion = false;
    this.requiereObservacion = false;
    this.form.get('observacion')?.disable();
    this.form.get('observacion')?.reset();
  }

  private verificarCedula(cedula: string): void {
    if (!cedula || cedula.length < 8) {
      this.showSnackBar('La cédula debe tener al menos 8 dígitos');
      return;
    }

    this.verificando = true;
    this.errorVerificacion = false;

    const cedulaData: RegistroRequest = {
      cedula: cedula,
      observacion: '',
    };

    this.dialogservice.registerIngreso(cedulaData)
      .pipe(
        finalize(() => this.verificando = false)
      )
      .subscribe({
        next: (resultado) => {
          if (resultado) {
            this.resultadoIngreso = resultado;
            this.verificarUltimaSalida(resultado);
            
            if (this.requiereObservacion) {
              this.manejarCampoObservacion();
            } else {
              // Si no requiere observación, enviamos directamente
              const result = {
                ...resultado,
                observacion: undefined,
                tipo_salida: this.tipoSalida
              };
              this.dialogRef.close(result);
            }
          } else {
            this.errorVerificacion = true;
            this.showSnackBar('No se encontró registro con esta cédula');
          }
        },
        error: (error) => {
          this.errorVerificacion = true;
          this.mostrarObservacion = true;
          this.requiereObservacion = true;
          
          const observacionControl = this.form.get('observacion');
          observacionControl?.enable();
          observacionControl?.setValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(500)
          ]);
          observacionControl?.updateValueAndValidity();
          
          this.showSnackBar(error.message || 'Error al verificar la cédula');
          console.error('Error:', error);
        }
      });
}

onSubmit(): void {
    if (!this.form.valid) {
      this.showSnackBar('Por favor complete todos los campos requeridos');
      return;
    }

    const observacion = this.form.get('observacion')?.value;
    
    // Validación específica para observación cuando es requerida
    if (this.requiereObservacion && (!observacion || observacion.trim().length < 10)) {
      this.showSnackBar('Debe ingresar una observación de al menos 10 caracteres');
      return;
    }
    
    // Preparamos el objeto final
    const datosFinal: RegistroRequest = {
      cedula: this.form.get('cedula')?.value,
      observacion: this.requiereObservacion ? observacion : undefined
    };

    // Enviamos los datos actualizados
    this.dialogservice.registerIngreso(datosFinal)
      .subscribe({
        next: (response) => {
          console.log('Registro guardado:', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error al guardar:', error);
          this.showSnackBar('Error al guardar el registro');
        }
      });
}

  private verificarUltimaSalida(resultado: IngresoPersonal): void {
    if (!resultado.asistencia?.ultima_salida) {
      this.mostrarObservacion = false;
      this.requiereObservacion = false;
      return;
    }

    const ultimaSalida = resultado.asistencia.ultima_salida;
    this.tipoSalida = ultimaSalida.tipo_salida || '';
    
    // Verificar si la última salida fue por cita médica
    this.requiereObservacion = this.tipoSalida.toUpperCase() === 'CITA MEDICA';
    this.mostrarObservacion = this.requiereObservacion;
  }

  private manejarCampoObservacion(): void {
    const observacionControl = this.form.get('observacion');
    
    if (!this.requiereObservacion) {
      observacionControl?.enable();
      observacionControl?.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]);
      this.showSnackBar('Por favor ingrese una observación detallada sobre la cita médica');
    } else {
      observacionControl?.disable();
      observacionControl?.clearValidators();
      observacionControl?.reset();
    }
    
    observacionControl?.updateValueAndValidity();
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