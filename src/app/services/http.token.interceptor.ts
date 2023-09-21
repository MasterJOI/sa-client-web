import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {exhaustMap, Observable, take} from "rxjs";
import {AuthStore} from './auth.store';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(private authStore: AuthStore) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authStore.authData$.pipe(
      take(1),
      exhaustMap(authData => {
        if (authData && authData.token !== '') {

          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authData.token}`)
          });
          return next.handle(authReq);
        }
        return next.handle(req);
      })
    );
  }
}
