import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (...roles: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.hasValidToken()) {
    return router.createUrlTree(['/login']);
  }

  if (auth.hasRole(...roles)) {
    return true;
  }

  const currentRole = auth.currentUser()?.role;
  return currentRole ? router.createUrlTree(['/dashboard', currentRole]) : router.createUrlTree(['/login']);
};
