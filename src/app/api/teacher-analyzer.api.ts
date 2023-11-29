import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {QuestionnaireAnalysis} from '../dto/questionnaire_analysis/QuestionnaireAnalysis';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherAnalyzerApi {

  private http = inject(HttpClient);

  public analyzeQuestionnaire(file: File, specialties: string): Observable<QuestionnaireAnalysis> {

    let formData: FormData = new FormData();
    if (file) formData.append('file', file);
    if (specialties) formData.append('specialties', specialties);

    return this.http.post<QuestionnaireAnalysis>(
      `${environment.api}/processing`, formData);
  }
}
