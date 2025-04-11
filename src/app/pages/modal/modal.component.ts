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
  tipoSalida = '';
  

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
  onSubmit(): void {
    if (this.form.valid) {
      if (this.mostrarObservacion && !this.form.get('observacion')?.value) {
        this.showSnackBar('Se requiere una observación para cita médica');
        return;
      }
      this.dialogRef.close(this.resulatadoIngreso);
    }
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
        }
      });
  }
  private verificarCedula(cedula: string): void {
    if (!cedula || cedula.length < 8) {
        this.showSnackBar('La cédula debe tener al menos 8 dígitos');
        return;
    }

    this.verificando = true;
    this.errorVerificacion = false;

    const cedulaData: RegistroRequest = {
        cedula: cedula.trim(),
        observacion: '',
        //this.form.get('observacion')?.value || ''
    };

    this.dialogservice.registerIngreso(cedulaData)
        .pipe(
            finalize(() => this.verificando = false),
            catchError(error => {
                this.errorVerificacion = true;
                this.showSnackBar('Error al verificar la cédula');
                console.error('Error:', error);
                return EMPTY;
            })
        )
        .subscribe({
            next: (resultado) => {
                if (resultado) {
                    this.resulatadoIngreso = resultado;
                    // Verificar si es cita médica
                    if (resultado.asistencia?.ultima_salida?.tipo_salida === 'CITA MEDICA') {
                        this.mostrarObservacion = true;
                        this.tipoSalida = 'CITA MEDICA';
                        this.form.get('observacion')?.enable();
                        this.form.get('observacion')?.setValue(resultado.asistencia?.observacion || '');
                    } else {
                        this.mostrarObservacion = false;
                        this.tipoSalida = resultado.asistencia?.ultima_salida?.tipo_salida || '';
                        this.dialogRef.close(resultado);
                        this.form.get('observacion')?.disable();
                    }
                    // this.dialogRef.close(resultado);
                } else {
                    this.errorVerificacion = true;
                    this.showSnackBar('No se encontró registro con esta cédula');
                }
            }
        });
}

 

private initializeForm(): void {
  this.form = this.fb.group({
    cedula: ['', [Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(8)]],
    observacion: [{ value: '', disabled: !this.mostrarObservacion 
    }]
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