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
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(9)]],
      observacion: ['']
    });
  }

  private setupCedulaValidation(): void {
    this.form.get('cedula')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(cedula => {
        if (cedula && this.form.get('cedula')?.valid) {
          this.errorVerificacion = false;
          this.resetFormState();
          this.verificarCedula(cedula);
        } else {
          this.resetFormState();
          this.errorVerificacion = true;
          console.log('Error: La cédula no es válida o está incompleta.');
          
        }
      });
  }

  private resetFormState(): void {
    this.mostrarObservacion = false;
    this.requiereObservacion = false;
    this.form.get('observacion')?.disable();
    this.form.get('observacion')?.reset();
  }
// verificar la cedula
 private verificarCedula(cedula: string, observacion?: string): void {
    if (!cedula || cedula.length < 10) {
        this.showSnackBar('La cédula debe tener al menos 10 dígitos');
        return;
    }
        if (observacion?.toLowerCase().includes('cita médica') || 
        observacion?.toLowerCase().includes('compensatorio') || 
        observacion?.toLowerCase().includes('dia no remunerado')) {
        this.mostrarObservacion = true;
        this.requiereObservacion = true;
        this.manejarCampoObservacion();
        this.showSnackBar('Por favor ingrese una observación detallada sobre la cita médica');
    } else {
        this.mostrarObservacion = false;
        this.requiereObservacion = false;
        this.form.get('observacion')?.disable();
        this.form.get('observacion')?.reset();
    }

    this.verificando = true;
    this.errorVerificacion = false;

    const cedulaData: RegistroRequest = {
        cedula: cedula,
        observacion: this.requiereObservacion ? observacion?.trim() : null
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
                        this.mostrarObservacion = true;
                        this.manejarCampoObservacion();
                        this.showSnackBar('Por favor ingrese una observación detallada');
                    } else {
                        this.mostrarObservacion = false;
                        this.requiereObservacion = false;
                        this.form.get('observacion')?.disable();
                        this.form.get('observacion')?.reset();
                        this.showSnackBar('Cédula verificada correctamente. Puede proceder a guardar.');
                    }
                } else {
                    this.errorVerificacion = true;
                    this.showSnackBar('Error al verificar la cédula');
                }
            },
            error: (error) => {
                this.errorVerificacion = true;

                const errorMessage = error.message || 'Error al verificar la cédula';
                console.error('Error:', error);

                if (errorMessage.includes('ya tiene una entrada activa')) {
                    this.mostrarObservacion = false;
                    this.requiereObservacion = false;
                } else {
                    this.mostrarObservacion = true;
                    this.requiereObservacion = true;
                    this.manejarCampoObservacion();
                }

                this.showSnackBar(errorMessage);
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

    if (this.tipoSalida.toLowerCase() === 'cita médica') {
        this.requiereObservacion = true;
        this.mostrarObservacion = true;
        this.manejarCampoObservacion();
        this.showSnackBar('Por favor ingrese una observación detallada sobre la cita médica');
    } else {
        this.requiereObservacion = false;
        this.mostrarObservacion = false;
        this.form.get('observacion')?.disable();
        this.form.get('observacion')?.reset();
        this.showSnackBar('Cédula verificada correctamente. Puede proceder a guardar.');
    }
}

private manejarCampoObservacion(): void {
    const observacionControl = this.form.get('observacion');

    if (this.requiereObservacion) {
        observacionControl?.enable();
        observacionControl?.setValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(500)
        ]);
    } else {
        observacionControl?.disable();
        observacionControl?.clearValidators();
        observacionControl?.reset();
    }

    observacionControl?.updateValueAndValidity();
}

onSubmit(): void {
    console.log('Estado del formulario:', this.form.value);
    console.log('¿Formulario válido?:', this.form.valid);

    if (!this.form.valid) {
        this.showSnackBar('Por favor complete todos los campos requeridos');
        return;
    }

    const cedula = this.form.get('cedula')?.value;
    const observacion = this.form.get('observacion')?.value;

    if (this.requiereObservacion && (!observacion || observacion.trim().length < 10)) {
        this.showSnackBar('La observación debe tener al menos 10 caracteres');
        return;
    }

    const datosFinal: RegistroRequest = {
        cedula: cedula,
        observacion: this.requiereObservacion ? observacion?.trim() : null
    };

    console.log('Datos a enviar:', datosFinal);

    this.dialogservice.registerIngreso(datosFinal)
        .subscribe({
            next: (response) => {
                console.log('Registro guardado:', response);
                this.showSnackBar(response.message);

                if (this.requiereObservacion) {
                    this.dialogRef.close(response);
                } else {
                    console.log('El diálogo permanece abierto porque no requiere observación.');
                }
            },
            error: (error) => {
                console.error('Error al guardar:', error);
                this.showSnackBar(error.message || 'Error al guardar el registro');
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
}