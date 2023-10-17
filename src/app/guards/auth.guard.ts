import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthStore} from '../services/auth.store';
import {map} from 'rxjs';

export const authGuard = () => {

  const authStore = inject(AuthStore);
  const router = inject(Router);

  return authStore.isLoggedIn$.pipe(
    map(res => {
      return true;
      /*if (!res) {
        return router.parseUrl('/login');
      } else {
        return true;
      }*/
    })
  )
};
