import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {AuthStore} from './services/auth.store';
import {switchMap, take} from 'rxjs';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {RouterModule} from '@angular/router';
import {routes} from './app-routing';
import {HttpTokenInterceptor} from './services/http.token.interceptor';
import {initFlowbite} from 'flowbite';
import {LoadingService} from './services/loading.service';

export const appConfig: ApplicationConfig = {
  providers: [
    LoadingService,
    importProvidersFrom(
      RouterModule.forRoot(routes),
      BrowserAnimationsModule,
      HttpClientModule,
      NgxWebstorageModule.forRoot(),
      ToastrModule.forRoot({
        timeOut: 8000,
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
          initFlowbite();
          return authStore.autoLogin().pipe(
            // @ts-ignore
            switchMap(() => authStore.user$.pipe(take(1)))
          );
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
