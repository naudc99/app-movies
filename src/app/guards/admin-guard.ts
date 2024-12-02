import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/auth/login.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const loginSrv = inject(LoginService);
  const router = inject(Router);
  return loginSrv.isAdmin ? true : router.navigate(['/index']);
};