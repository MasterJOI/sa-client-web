import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {DynamicFormConfig} from '../forms/dynamic-forms.model';
import {FormGroup} from '@angular/forms';
import {ApiResponse} from '../dto/ApiResponse';
import {Subdivision} from '../dto/subdivision/Subdivision';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormsApi {

  private http = inject(HttpClient);

  public loadFormConfig(configName: string): Observable<{ form: FormGroup<{}>; config: DynamicFormConfig }> {
    return this.http.get<DynamicFormConfig>(`assets/form-configs/${configName}.form.json`).pipe(
      map(config => ({
        config,
        form: new FormGroup({})
      }))
    );
  }

  public getSubdivisions(): Observable<Subdivision[]> {
    return this.http.get<Subdivision[]>(
      `${environment.api}/subdivision/all`);
  }
}
