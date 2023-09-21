import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {AuthStore} from './services/auth.store';
import {take} from 'rxjs';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {RouterModule} from '@angular/router';
import {routes} from './app-routing';
import {HttpTokenInterceptor} from './services/http.token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes),
      BrowserAnimationsModule,
      HttpClientModule,
      NgxWebstorageModule.forRoot(),
      ToastrModule.forRoot({
        timeOut: 10000,
        positionClass: 'toast-top-right',
        maxOpened: 5,
        preventDuplicates: false,
        autoDismiss: true
      }),
    ),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (authStore: AuthStore) => {
        return () => {
          authStore.autoLogin();
          return authStore.user$.pipe(take(1));
        }
      },
      deps: [AuthStore]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
  ]
};
