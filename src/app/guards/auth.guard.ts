import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthStore} from '../services/auth.store';

export const authGuard = () => {

  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isLoggedIn$.subscribe(isLoggedIn => isLoggedIn)) {
    return true;
  }
  return router.parseUrl('/login');
};
