import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';

import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authReady$.pipe(

    filter(ready => ready),

    take(1),

    map(() => {

      if (authService.isAdmin()) {
        return true;
      }

      return router.createUrlTree(['/']);
    })

  );
};