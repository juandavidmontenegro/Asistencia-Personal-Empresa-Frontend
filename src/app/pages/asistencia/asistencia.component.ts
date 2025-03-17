import { Component, inject } from '@angular/core';
import { DialogService } from '../../service/ingresos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, catchError, of } from 'rxjs';
import { RegistroDialogComponent } from '../modal/modal.component';
import { Modal2Component } from '../modal2/modal2.component';
import { RelojComponent } from "../hora-fecha/reloj.component";
import { DatefechaComponent } from "../hora-fecha/date.component";
import { TablaComponent } from "../tabla/tabla.component";

@Component({
  selector: 'app-asistencia',
  standalone: true,
  templateUrl: './asistencia.component.html',
  imports: [RelojComponent, DatefechaComponent, TablaComponent]
})
export class AsistenciaComponent {

  constructor(
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) { }

  openIngreso(): void {
    this.dialogService.openModal(RegistroDialogComponent)
      .subscribe({
        
        
        next: (result) => {
         
          
          if (result && 'message' in result && 'asistencia' in result) { 
            this.snackBar.open(result.message, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          } else if (result && 'message' in result && 'error' in result) { 
            this.snackBar.open(` ${result.message}`, 'Cerrar', {
              duration: 6000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'] 
            });
          } else {
            this.snackBar.open('Operación cancelada', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          }
        },
        error: (error) => {
          console.error('Error inesperado en openIngreso:', error);
          this.snackBar.open('Error inesperado al registrar el ingreso', 'Cerrar', {
            duration: 3000,
          });
        }
      });
  }
  
  openSalida(){
    this.dialogService.exitModal(Modal2Component)
      .subscribe({
        next: (result) => {
          if (result && 'message' in result && 'asistenciasalida' in result) {
            this.snackBar.open(result.message, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          } else if (result && 'message' in result && 'error' in result) {
            this.snackBar.open(` ${result.message}`, 'Cerrar', {
              duration: 4000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'] 
            });
          } else {
            this.snackBar.open('Operación cancelada', 'Cerrar', {
              duration: 2000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          }
        },
        error: (error) => {
          console.error('Error inesperado en openSalida:', error);
          this.snackBar.open('Error inesperado al registrar la salida', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      });
  }
  
}
