import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-reloj',
    standalone: true,
    template: `
        <p>{{ currentTime }}</p>
    `,
})
export class RelojComponent implements OnInit, OnDestroy {
     currentTime: string = '';
    private intervalId: any // Tipo correcto
  
    ngOnInit() {
      this.intervalId = setInterval(() => {
        this.currentTime = new Date().toLocaleTimeString();
      }, 1000);
    }
  
    ngOnDestroy() {
      clearInterval(this.intervalId);
    }

    

}
