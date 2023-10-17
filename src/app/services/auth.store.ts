import {BehaviorSubject, catchError, map, Observable, shareReplay, skip, switchMap, tap, throwError} from 'rxjs';
import {DestroyRef, inject, Injectable} from '@angular/core';
import {AuthData} from '../dto/auth/AuthData';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ToastrService} from 'ngx-toastr';
import {UserApi} from '../api/user.api';
import {CurrentUser} from '../dto/auth/CurrentUser';
import {LocalStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {AuthApi} from '../api/auth.api';
import {UserRegistrationRequestBody} from '../dto/auth/UserRegistrationRequestBody';
import {AUTH_DATA} from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  private userSubject = new BehaviorSubject<CurrentUser | null>(null);
  user$ = this.userSubject.asObservable();

  authData$ = new BehaviorSubject<AuthData | null>(null);

  isLoggedIn$: Observable<boolean>;

  private tokenExpirationTimer: any;

  private userApi = inject(UserApi);
  private authApi = inject(AuthApi);
  private toastr = inject(ToastrService);
  private storageService = inject(LocalStorageService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private static getTokenExpirationDate(token: string) {
    return new Date((JSON.parse(atob(token.split('.')[1]))).exp * 1000);
  }

  private static getTokenExpirationPeriod(expirationDate: string) {
    return new Date(expirationDate).getTime() - new Date().getTime();
  }

  constructor() {
    this.isLoggedIn$ = this.user$.pipe(
      map(user => !!user),
      takeUntilDestroyed()
    );
  }

  getAuthData() {
    const authData: AuthData | null = this.storageService.retrieve(AUTH_DATA);
    if (!authData || authData.token === '') {
      return null;
    }
    return new AuthData(
      authData.token,
      authData._expirationDate
    );
  }

  setAuthData(authData: AuthData) {
    this.storageService.store(AUTH_DATA, authData);
  }

  public isUserHasPermission(permissionName: string): boolean {
    let isUserHasPermission = false;

    this.user$.pipe(
      map(user => user?.permissions.some(permission => permission.name === permissionName)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => isUserHasPermission = res ?? false);

    return isUserHasPermission;
  }

  public loadCurrentUser() {
    return this.userApi.getCurrentUser()
      .pipe(
        map(response => response["data"]),
        catchError(err => {
          this.userSubject.next(null);
          this.toastr.warning('Не вдалося увійти');
          this.logOut();
          return throwError(err);
        }),
        tap(user => this.userSubject.next(user)),
        takeUntilDestroyed(this.destroyRef),
        shareReplay()
      );
  }

  register(registrationRequest: UserRegistrationRequestBody): Observable<CurrentUser> {
    return this.authApi.register(registrationRequest).pipe(
      map(response => response.data),
      switchMap(authData => {
        this.handleAuthentication(authData);
        return this.loadCurrentUser().pipe(
          tap(() => this.router.navigate(['']))
        )
      })
    );
  }

  login(user: { username: string, password: string }): Observable<CurrentUser> {
    return this.authApi.login(user)
      .pipe(
        map(response => {
          return response["data"];
        }),
        switchMap(authData => {
          this.handleAuthentication(authData);
          return this.loadCurrentUser().pipe(
            tap(() => this.router.navigate(['']))
          )
        })
      );
  }

  handleAuthentication(authData: AuthData) {
    authData._expirationDate = AuthStore.getTokenExpirationDate(authData.token);
    this.setAuthData(authData);
    this.authData$.next(authData);
    this.autoLogOut(AuthStore.getTokenExpirationPeriod(authData._expirationDate.toString()));
  }

  autoLogin() {
    const authData = this.getAuthData();
    this.authData$.next(authData);

    if (!authData) {
      this.userSubject.next(null);
      return;
    }

    if (!this.userSubject.getValue()) {
      this.loadCurrentUser().subscribe();
    }

    this.autoLogOut(AuthStore.getTokenExpirationPeriod(authData._expirationDate.toString()));
  }

  logOut() {
    this.storageService.clear(AUTH_DATA);
    this.authData$.next(null);
    this.userSubject.next(null);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/login']);
  }

  autoLogOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }
}
