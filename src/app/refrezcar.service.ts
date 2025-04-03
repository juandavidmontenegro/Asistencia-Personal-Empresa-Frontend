import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private readonly REFRESH_INTERVAL = 5000;
  private refreshSubject = new BehaviorSubject<boolean>(true);
  refresh$ = this.refreshSubject.asObservable();

  startAutoRefresh() {
    return timer(0, this.REFRESH_INTERVAL);
  }

  forceRefresh() {
    this.refreshSubject.next(true);
  }
}