import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth-services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink , RouterLinkActive],
  templateUrl: './nav.component.html'
})
export class NavComponent {

  constructor(public authService : AuthService){}



}
