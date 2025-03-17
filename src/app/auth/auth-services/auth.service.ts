import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../auth-interface/auth-response.interface';
import { User } from '../auth-interface/auth-login.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { enviroment } from '../../../enviroments/dev.enviroment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const UrlApi = enviroment.UrlApi;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {}

    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(localStorage.getItem('token'));
    private _isChecking = signal<boolean>(false); // Nuevo: señal para loading

    // Computed que devuelve el estado de autenticación
    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';
        if (this._user()) return 'authenticated';
        return 'not-authenticated';
    });

    user = computed<User | null>(() => this._user());
    token = computed<string | null>(() => this._token());
    isAdmin = computed<boolean>(() => this.user()?.role.includes('ADMIN') ?? false);
    isChecking = computed<boolean>(() => this._isChecking()); // Nueva computed para el estado de carga

    login(email: string, password: string) {
        return this.http.post<AuthResponse>(`${UrlApi}/auth/login`, { email, password }).pipe(
            tap((resp) => {
                this._authStatus.set('authenticated');
                this._token.set(resp.user.token);
                this._user.set(resp.user);
                localStorage.setItem('token', resp.user.token);
                localStorage.setItem('role', resp.user.role);
            }),
            map(() => true),
            catchError(() => {
                this.logout();
                return of(false);
            })
        );
    }

    logout() {
        this._authStatus.set('not-authenticated');
        this._user.set(null);
        this._token.set(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    // Checkstatus SIN rxResource, controlado manualmente
    checkStatus(): Observable<boolean> {
        this._isChecking.set(true); // Activar loading
        this._authStatus.set('checking');

        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || !role) {
            this.logout();
            this._isChecking.set(false);
            return of(false);
        }

        return this.http.get<AuthResponse>(`${UrlApi}/auth/check-status`).pipe(
            map((resp) => {
                if (!resp || !resp.user || !resp.user.token) {
                    this.logout();
                    return false;
                }
                this._authStatus.set('authenticated');
                this._user.set(resp.user);
                this._token.set(resp.user.token);
                return true;
            }),
            catchError(() => {
                this.logout();
                return of(false);
            }),
            tap(() => {
                this._isChecking.set(false); // Termina loading
            })
        );
    }
    isAuthenticated(): boolean {
       // implemente la logica de autenticacion
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || !role) {
            this.logout();
            return false;
        }
        return true; // Example implementation
      }
}
