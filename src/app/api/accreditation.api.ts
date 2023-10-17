import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {EducationProgram} from '../dto/education_programs/EducationProgram';
import {Advise} from '../dto/self_assessment/Advise';
import {SelfAssessmentInfo} from '../dto/self_assessment/SelfAssessmentInfo';
import {ChangedFields, CriteriaUpdateRequestBody} from '../dto/self_assessment/CriteriaUpdateRequestBody';
import {ApiResponse} from '../dto/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AccreditationApi {

  private http = inject(HttpClient);

  public fetchEducationPrograms(from: number, count: number): Observable<EducationProgram[]> {
    return this.http.get<EducationProgram[]>(
      `${environment.api}/accreditation/all?from=${from}&count=${count}`);
  }

  public fetchSelfAssessmentInfo(programId: number): Observable<SelfAssessmentInfo> {
    return this.http.get<SelfAssessmentInfo>(
      `${environment.api}/accreditation/${programId}`);
  }

  public saveChangedCriteria(id: string, criteria: ChangedFields<CriteriaUpdateRequestBody>): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${environment.api}/accreditation/${id}`, criteria);
  }

  public deletePrograms(IDs: number[]): Observable<any> {
    return this.http.delete<any>(
      `${environment.api}/accreditation?IDs=${IDs}`);
  }

  public fetchAdvice(label: string): Observable<Advise> {
    return this.http.get<Advise>(
      `${environment.api}/adviser/advise?startWith=${label}`);
  }

  public generateSelfAssessmentDocument(programId: number): Observable<Blob> {
    let params = new HttpParams()
      .append('programId', programId)
    return this.http.get<Blob>(
      `${environment.api}/accreditation/generate`,
      {responseType: 'blob' as 'json', params: params});
  }

  public createProgram(data: any): Observable<ApiResponse<EducationProgram>> {
    return this.http.post<ApiResponse<EducationProgram>>(
      `${environment.api}/accreditation/new`, data);
  }
}
