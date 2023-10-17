import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ApiResponse} from '../dto/ApiResponse';
import {StudyResult} from '../dto/self_assessment/SelfAssessmentInfo';
import {StudyResultInformationRequestBody} from '../dto/self_assessment/tables/StudyResultInformationRequestBody';

@Injectable({
  providedIn: 'root'
})
export class StudyResultsInformationApi {

  private http = inject(HttpClient);

  public updateStudyResultsInformation(id: string, body: StudyResultInformationRequestBody): Observable<ApiResponse<StudyResult>> {

    return this.http.put<ApiResponse<StudyResult>>(
        `${environment.api}/study-result/${id}`, body);
  }

  public createStudyResultsInformation(selfAssessmentId: string, data: StudyResultInformationRequestBody): Observable<ApiResponse<StudyResult>> {

    return this.http.post<ApiResponse<StudyResult>>(
        `${environment.api}/study-result/new/${selfAssessmentId}`, data);
  }

  deleteStudyResultsInformation(id: string): Observable<any> {
    return this.http.delete<any>(
        `${environment.api}/study-result/${id}`);
  }
}
