import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const dashboardRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const currentRole = auth.currentUser()?.role;

  if (!auth.hasValidToken()) {
    return router.createUrlTree(['/login']);
  }

  if (currentRole) {
    return router.createUrlTree(['/dashboard', currentRole]);
  }

  return router.createUrlTree(['/login']);
};
