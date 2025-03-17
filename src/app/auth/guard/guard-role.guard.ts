import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';

export const guardRoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkStatus().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }

      if (!authService.isAdmin()) {
        router.navigate(['/dashboard/user']);
        return false;
      }

      return true;
    })
  );
};