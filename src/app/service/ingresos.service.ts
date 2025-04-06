import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { enviroment } from '../../enviroments/dev.enviroment';
import { IngresoPersonal } from '../interface/ingreso.interface';
import { ErrorIngreso } from '../interface/errores-ingreso.interface';
import { SalidaPersonal } from '../interface/exit.interface';
import { TotalPerson } from '../interface/attentends.interface';
import { EmpleadosRegistrados } from '../interface/empleados.interface';
import { Empresas } from '../interface/totalempresa';
import { RealTimeService } from './../refrezcar.service';





const apiUrl = enviroment.UrlApi;

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private realTimeService : RealTimeService
    ) {}
    closeAll(): void {
        this.dialog.closeAll();
    }
    openModal<CT>(componentRef: ComponentType<CT>): Observable<IngresoPersonal | ErrorIngreso | null> {
        const dialogRef = this.dialog.open(componentRef, {
          width: '400px',
          disableClose: true,
        });
        return dialogRef.afterClosed().pipe(
          switchMap(result => {
            if (result && typeof result === 'object' && 'cedula' in result) { 
              return this.registerIngreso(result).pipe(
                map(apiResponse => {
                  return apiResponse; 
                }),
                catchError((error: ErrorIngreso) => {
                  const errorData: ErrorIngreso = {
                    message: error.message,
                    error: error.error,
                  };
                  return of(errorData); 
                })
              );
            }
            return of(null);
          })
        );
      }
     exitModal<CT>( componentRef : ComponentType<CT> ): Observable<SalidaPersonal | ErrorIngreso | null> {
        const dialogRef = this.dialog.open(componentRef, {
          width: '400px',
          disableClose: true,
        });
        return dialogRef.afterClosed().pipe(
          switchMap(result => {
      
            if (result && typeof result === 'object' && 'cedula' in result) { 
              return this.salidapersonal(result).pipe(
                map(apiResponse => {
                  return apiResponse; 
                }),
                catchError((error: ErrorIngreso) => {
                  const errorData: ErrorIngreso = {
                    message: error.message,
                    error: error.error,
                  };
                  return of(errorData); 
                })
              );
            }
            return of(null);
          })
        );
     } 
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ha ocurrido un error en el registro';

        if (error.status === 401) {
            errorMessage = 'No está autorizado para realizar esta acción';
        } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Solicitud incorrecta, revise los datos enviados';
        } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor, intente más tarde';
        }

        return throwError(() => new Error(errorMessage));
    }
     salidapersonal(salida: SalidaPersonal): Observable<SalidaPersonal> {
        return this.http.post<SalidaPersonal>(`${apiUrl}/register/salida`,
            salida, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            }
        ).pipe(
            catchError(this.handleError)
        );
    }
     registerIngreso(ingresar: IngresoPersonal): Observable<IngresoPersonal> {
        return this.http.post<IngresoPersonal>(`${apiUrl}/register/ingreso`,
            ingresar, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            }
        ).pipe(
            catchError(this.handleError)
        );
    }
    getUsers(page: number = 1, limit: number = 5): Observable<TotalPerson> {
      const params = new HttpParams().set('page', page).set('limit', limit);

      return this.realTimeService.startRealTimeUpdates<TotalPerson>(() => {
        return this.http.get<TotalPerson>(`${apiUrl}/register`, { params }).pipe(
          catchError(error => {
            console.error('Error obteniendo usuarios:', error);
            throw error;
          })
        );
      });
    }

    deleteUser(id: string) {
      return this.http.delete(`${apiUrl}/register/${id}`).pipe(
        catchError(error => {
          console.error('Error eliminando usuario:', error);
          throw error;
        })
      );
    }

    getTotales(){
      return this.realTimeService.startRealTimeUpdates(() => {
        return this.http.get<EmpleadosRegistrados>(`${apiUrl}/register/empleados`).pipe(
          catchError(error => {
            console.error('Error obteniendo totales:', error);
            throw error;
          })
        );
      });
    }

    obtenerEmpresa(){
      return this.realTimeService.startRealTimeUpdates(() => {
        return this.http.get<Empresas>(`${apiUrl}/register/empresa`).pipe(
            catchError(error => {
              console.error('Error obteniendo el numero de empresa:', error);
              throw error;
            })
          )
      })
    }

}





