import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Subdivision} from '../dto/subdivision/Subdivision';
import {environment} from '../../environments/environment';
import {Speciality} from '../dto/speciality/Speciality';
import {Language} from '../dto/language/Lanugage';
import {Hei} from '../dto/hei/Hei';
import {Teacher} from '../dto/teacher/Teacher';

@Injectable({
  providedIn: 'root'
})
export class FormsApi {

  private http = inject(HttpClient);

  public getSubdivisions(): Observable<Subdivision[]> {
    return this.http.get<Subdivision[]>(
      `${environment.api}/subdivision/all`);
  }

  public getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(
      `${environment.api}/language/all`);
  }

  getSpecialities(): Observable<Speciality[]> {
    return this.http.get<Speciality[]>(
      `${environment.api}/speciality/all`);
  }

  getHeis(): Observable<Hei[]> {
    return this.http.get<Hei[]>(
      `${environment.api}/hei/all`);
  }

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(
      `${environment.api}/users/teacher/all`);
  }
}
