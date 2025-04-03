import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RealTimeService {
  private readonly POLLING_INTERVAL = 3000; // 3 segundos
  private dataSubject = new BehaviorSubject<any[]>([]);
  public data$ = this.dataSubject.asObservable();

  startRealTimeUpdates<T>(apiCall: () => Observable<T>): Observable<T> {
    return timer(0, this.POLLING_INTERVAL).pipe(
      switchMap(() => apiCall()),
      shareReplay(1)
    );
  }
}