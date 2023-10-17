import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ApiResponse} from '../dto/ApiResponse';
import {ComponentInformationRequestBody} from '../dto/self_assessment/tables/ComponentInformationRequestBody';
import {ProgramEducationalComponent} from '../dto/self_assessment/SelfAssessmentInfo';

@Injectable({
  providedIn: 'root'
})
export class ProgramComponentsApi {

  private http = inject(HttpClient);

  public updateComponentInformation(id: string, data: ComponentInformationRequestBody): Observable<ApiResponse<ProgramEducationalComponent>> {

    let formData: FormData = new FormData();
    if (data.file) formData.append('file', data.file);
    formData.append('componentName', data.componentName);
    formData.append('componentType', data.componentType.toString());
    formData.append('specialEquipmentInfo', data.specialEquipmentInfo);

    return this.http.put<ApiResponse<ProgramEducationalComponent>>(
      `${environment.api}/components/${id}`, formData);
  }

  public createComponentInformation(selfAssessmentId: string, data: ComponentInformationRequestBody): Observable<ApiResponse<ProgramEducationalComponent>> {

    let formData: FormData = new FormData();
    if (data.file) formData.append('file', data.file);
    formData.append('componentName', data.componentName);
    formData.append('componentType', data.componentType.toString());
    formData.append('specialEquipmentInfo', data.specialEquipmentInfo);

    return this.http.post<ApiResponse<ProgramEducationalComponent>>(
      `${environment.api}/components/new/${selfAssessmentId}`, formData);
  }

  deleteComponentInformation(id: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.api}/components/${id}`);
  }

  public downloadFile(id: string): Observable<Blob> {
    let params = new HttpParams()
      .append('id', id)
    return this.http.get<Blob>(
      `${environment.api}/components/download`,
      {responseType: 'blob' as 'json', params: params});
  }
}
