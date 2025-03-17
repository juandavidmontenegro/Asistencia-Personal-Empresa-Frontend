import { Component, inject, signal } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth-services/auth.service';
import { CommonModule } from '@angular/common';


const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatLabel
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [materialModules, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  public loginForm!: FormGroup;
  public hasError = signal(false);
  public errorMessage = signal<string>('');
  public isLoading = signal(false);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showError('Por favor, complete todos los campos correctamente');
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isLoading.set(true);

    this.authService.login(email, password)
      .subscribe({
        next: (isAuthenticated) => {
          if (isAuthenticated) {
            this.router.navigate(['/dashboard']);
          } else {
            this.showError('Credenciales incorrectas');
          }
        },
        error: (error) => {
          console.error('Error durante el login:', error);
          this.showError('Error al iniciar sesión. Por favor, intente nuevamente');
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
  }

  private showError(message: string): void {
    this.hasError.set(true);
    this.errorMessage.set(message);
    setTimeout(() => {
      this.hasError.set(false);
      this.errorMessage.set('');
    }, 3000);
  }

  // Getters para facilitar la validación en el template
  get emailField() {
    return this.loginForm.get('email');
  }

  get passwordField() {
    return this.loginForm.get('password');
  }


 



}