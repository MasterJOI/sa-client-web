import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../dto/ApiResponse';
import {environment} from '../../environments/environment';
import {CurrentUser} from '../dto/auth/CurrentUser';

@Injectable({
  providedIn: 'root'
})
export class UserApi {

  private http = inject(HttpClient);

  public getCurrentUser(): Observable<ApiResponse<CurrentUser>> {
    return this.http.get<ApiResponse<CurrentUser>>(
        `${environment.api}/users/me`
    );
  }
}
