import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Subdivision} from '../dto/subdivision/Subdivision';
import {environment} from '../../environments/environment';
import {Speciality} from '../dto/speciality/Speciality';

@Injectable({
  providedIn: 'root'
})
export class FormsApi {

  private http = inject(HttpClient);

  public getSubdivisions(): Observable<Subdivision[]> {
    return this.http.get<Subdivision[]>(
      `${environment.api}/subdivision/all`);
  }

  getSpecialities(): Observable<Speciality[]> {
    return this.http.get<Speciality[]>(
      `${environment.api}/speciality/all`);
  }
}
