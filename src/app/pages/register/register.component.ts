import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterService } from '../../service/register.service';
import { Tabla2Component } from "../tabla2/tabla2.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    Tabla2Component
],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  profileForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],  // Validamos que solo sean números
      nombrecompleto: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      jefeInmediato: ['', Validators.required],
      cargo: ['', Validators.required],
      empresa: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.showSnackBar('Por favor complete todos los campos correctamente');
      return;
    }
    this.registerService.registerPerson(this.profileForm.value).subscribe({
      next: (response) => {
        this.showSnackBar(response.message);
        this.profileForm.reset();
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        // Capturar el mensaje específico del backend
        const errorMessage = error.error?.message || error.message || 'Error desconocido en el registro';
        this.showSnackBar(errorMessage);
      }
    });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 6000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  closebutton() {
    this.profileForm.reset();
  }
}
