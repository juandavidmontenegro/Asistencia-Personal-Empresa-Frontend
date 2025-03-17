import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService } from '../auth-services/auth.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.authStatus() === 'authenticated') {
            // Si está autenticado, lo redireccionamos y bloqueamos el historial
            this.redirectToDashboard();
            return false; // Bloquea la navegación al login
        }
        return true; // Permite acceso al login si no está autenticado
    }

    canActivateChild(): boolean {
        return this.canActivate();
    }

    private redirectToDashboard(): void {
        this.router.navigate(['/dashboard']).then(() => {
            // Manipula el historial del navegador para evitar que pueda volver atrás
            window.history.pushState(null, '', window.location.href);
            window.onpopstate = () => {
                window.history.pushState(null, '', window.location.href);
            };
        });
    }
}
