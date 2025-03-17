import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-date',
    standalone: true,
    template: `
        <span>{{currentDate}}</span>
    `,
})
export class DatefechaComponent implements OnInit, OnDestroy {
    currentDate: string = '';  
    private intervalId: any // Tipo correcto
  
    ngOnInit() {
      this.updateDate(); // Actualizar al inicio
      this.intervalId = setInterval(() => {
        this.updateDate();
      }, 60000); // Se actualiza cada minuto para evitar cálculos innecesarios
    }
  
    ngOnDestroy() {
      clearInterval(this.intervalId);
    }
  
    private updateDate() {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('es-ES', {  
        year: 'numeric', 
        month: 'long',  
        day: 'numeric'
      });
    }
}