import {Routes} from '@angular/router';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent:
      () => import('./pages/home/home.component')
        .then(m => m.HomeComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent:
          () => import('./pages/card-menu/card-menu.component')
            .then(m => m.CardMenuComponent),
      },
      {
        path: 'accreditation',
        loadChildren: () =>
          import('./pages/accreditation/accreditation.routes')
            .then(m => m.AccreditationRoutes)
      }
    ]
  },
  {
    path: 'login',
    loadComponent:
      () => import('./pages/auth/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent:
      () => import('./pages/auth/registration/registration.component')
        .then(m => m.RegistrationComponent),
  },
  {
    path: '404',
    pathMatch: 'full',
    loadComponent:
      () => import('./pages/not-found/not-found.component')
        .then(m => m.NotFoundComponent),
  },
  {path: '**', redirectTo: '/404'}
]
