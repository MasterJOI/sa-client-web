import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {EducationProgram, EducationProgramsData} from '../dto/education_programs/EducationProgram';
import {Advise} from '../dto/self_assessment/Advise';
import {ProgramEducationalComponent, SelfAssessmentInfo} from '../dto/self_assessment/SelfAssessmentInfo';
import {ChangedFields, CriteriaUpdateRequestBody} from '../dto/self_assessment/CriteriaUpdateRequestBody';
import {ApiResponse} from '../dto/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AccreditationApi {

  private http = inject(HttpClient);

  public fetchEducationPrograms(from: number, count: number): Observable<ApiResponse<EducationProgramsData>> {
    return this.http.get<ApiResponse<EducationProgramsData>>(
      `${environment.api}/accreditation/all?from=${from}&count=${count}`);
  }

  public fetchSelfAssessmentInfo(id: string): Observable<SelfAssessmentInfo> {
    return this.http.get<SelfAssessmentInfo>(
      `${environment.api}/accreditation/${id}`);
  }

  public saveChangedCriteria(id: string, criteria: ChangedFields<CriteriaUpdateRequestBody>): Observable<ApiResponse<SelfAssessmentInfo>> {
    return this.http.put<ApiResponse<SelfAssessmentInfo>>(
      `${environment.api}/accreditation/${id}`, criteria);
  }

  public deletePrograms(IDs: string[]): Observable<any> {
    return this.http.delete<any>(
      `${environment.api}/accreditation?IDs=${IDs}`);
  }

  public fetchAdvice(label: string): Observable<Advise> {
    return this.http.get<Advise>(
      `${environment.api}/adviser/advise?startWith=${label}`);
  }

  public generateSelfAssessmentDocument(id: string): Observable<Blob> {
    let params = new HttpParams()
      .append('id', id)
    return this.http.get<Blob>(
      `${environment.api}/accreditation/generate`,
      {responseType: 'blob' as 'json', params: params});
  }

  public createProgram(data: any): Observable<ApiResponse<EducationProgram>> {
    return this.http.post<ApiResponse<EducationProgram>>(
      `${environment.api}/accreditation/new`, data);
  }

  public uploadGeneralDocument(id: string, value: any): Observable<ApiResponse<any>> {

    let formData: FormData = new FormData();
    if (value.file) formData.append('file', value.file);
    formData.append('name', value.name);
    formData.append('type', value.type);

    return this.http.post<ApiResponse<ProgramEducationalComponent>>(
      `${environment.api}/accreditation/upload/${id}`, formData);
  }

  public downloadFile(id: string): Observable<Blob> {
    let params = new HttpParams()
      .append('id', id);
    return this.http.get<Blob>(
      `${environment.api}/accreditation/download`,
      {responseType: 'blob' as 'json', params: params});
  }
}
