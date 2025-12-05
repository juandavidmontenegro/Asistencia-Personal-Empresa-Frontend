import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegisterPerson } from '../interface/register.interface';
import { enviroment } from '../../enviroments/dev.enviroment';


const register = enviroment.UrlApi;

@Injectable({
    providedIn: 'root'
})
export class RegisterService {


    constructor(private http: HttpClient) {}


    registerPerson(person: RegisterPerson): Observable<RegisterPerson> {
        return this.http.post<RegisterPerson>(
            `${register}/register-person/register`,
            person,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            }
        ).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = '';

        if (error.status === 401) {
            errorMessage = 'No está autorizado para realizar esta acción';
        } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Solicitud incorrecta, revise los datos enviados';
        } else if (error.status === 409) {
            errorMessage = error.error?.message || 'Conflicto: El recurso ya existe';
        } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor, intente más tarde';
        } else if (error.error?.message) {
            errorMessage = error.error.message;
        }

        return throwError(() => error);
    }




}
