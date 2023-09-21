import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../dto/ApiResponse';
import {AuthData} from '../dto/auth/AuthData';
import {environment} from '../../environments/environment';
import {UserRegistrationRequestBody} from '../dto/auth/UserRegistrationRequestBody';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {

  private http = inject(HttpClient);

  public login(user: {username: string, password: string}): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(
      `${environment.api}/auth/login`,
      user
    );
  }


  public register(user: UserRegistrationRequestBody): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(
      `${environment.api}/auth/register`,
      user
    );
  }
}
