import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ApiResponse} from '../dto/ApiResponse';
import {TeacherInformation} from '../dto/self_assessment/SelfAssessmentInfo';
import {TeacherInformationRequestBody} from '../dto/self_assessment/tables/TeacherInformationRequestBody';

@Injectable({
  providedIn: 'root'
})
export class TeachersInformationApi {

  private http = inject(HttpClient);

  public updateTeacherInformation(id: string, body: TeacherInformationRequestBody): Observable<ApiResponse<TeacherInformation>> {

    return this.http.put<ApiResponse<TeacherInformation>>(
        `${environment.api}/teacher-information/${id}`, body);
  }

  public createTeacherInformation(selfAssessmentId: string, data: TeacherInformationRequestBody): Observable<ApiResponse<TeacherInformation>> {

    return this.http.post<ApiResponse<TeacherInformation>>(
        `${environment.api}/teacher-information/new/${selfAssessmentId}`, data);
  }

  deleteTeacherInformation(id: string): Observable<any> {
    return this.http.delete<any>(
        `${environment.api}/teacher-information/${id}`);
  }
}
