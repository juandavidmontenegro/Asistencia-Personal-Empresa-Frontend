import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavComponent } from "../nav/nav.component";
import { AuthService } from '../../auth/auth-services/auth.service';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';


const materialModules = [MatSidenavModule ,MatButtonModule, MatToolbarModule,MatButtonModule,MatMenuModule,
   MatIconModule, MatListModule , MatToolbarModule , MatSelectModule];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [materialModules, NavComponent, RouterOutlet , RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnDestroy {
  shouldRun: boolean = true;
  mobileQuery: MediaQueryList;
  isMenuOpen: boolean = true;
  private _mobileQueryListener: () => void;

  constructor( public authService : AuthService) {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }
  ngOnDestroy(): void {
    //this.mobileQuery.removeListener(this._mobileQueryListener);
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}