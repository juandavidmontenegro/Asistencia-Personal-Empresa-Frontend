import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './modal.component.html',
})
export class RegistroDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(8)]]
    });
  }
  onSubmit(): void {
    if (this.form.invalid) {
      this.showSnackBar('Por favor, ingrese una cédula válida (mínimo 8 dígitos numéricos)');
      return;
    }
  
    const cedulaValue = Number(this.form.get('cedula')?.value);
  
    if (isNaN(cedulaValue)) {
      this.showSnackBar('Error: La cédula debe ser un número válido');
      return;
    }
    this.dialogRef.close({ cedula: cedulaValue }); 
  
   //this.showSnackBar(`Cédula enviada: ${cedulaValue}`);
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
