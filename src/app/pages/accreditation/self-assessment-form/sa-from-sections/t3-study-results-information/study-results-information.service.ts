import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LoadingService} from '../../../../../services/loading.service';
import {ToastrService} from 'ngx-toastr';
import {StudyResult} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {EducationProgramsStore} from '../../../../../services/education-programs.store';
import {
  StudyResultInformationRequestBody
} from '../../../../../dto/self_assessment/tables/StudyResultInformationRequestBody';
import {StudyResultsInformationApi} from '../../../../../api/study-results-information.api';

@Injectable({
  providedIn: 'root'
})
export class StudyResultsInformationService {

  private loading = inject(LoadingService);
  private toastr = inject(ToastrService);
  private educationProgramsStore = inject(EducationProgramsStore);
  private studyResultsApi = inject(StudyResultsInformationApi);

  private studyResultsSubject = new BehaviorSubject<StudyResult[]>([]);
  studyResults$: Observable<StudyResult[]> = this.studyResultsSubject.asObservable();

  private selectedStudyResultSubject = new BehaviorSubject<StudyResult | null>(null);
  selectedStudyResult$: Observable<StudyResult | null> = this.selectedStudyResultSubject.asObservable();

  constructor() {
    this.studyResultsSubject.next(this.educationProgramsStore.getStudyResultsInformation());
  }

  sendStudyResultForm(isEditable: boolean, formData: any) {
    let studyResults = this.studyResultsSubject.getValue();
    let selectedStudyResult = this.selectedStudyResultSubject.getValue();
    let loadUpdateStudyResult$: Observable<any>;

    const body = this.setRequestBodyFromForm(formData);

    if (isEditable) {
      loadUpdateStudyResult$ = this.studyResultsApi.updateStudyResultsInformation(selectedStudyResult!.id, body).pipe(
        map(res => res.data),
        catchError(err => {
          this.toastr.warning('Не вдалося оновити інформацію про програмний результат навчання.');
          return throwError(err);
        }),
        tap(s => {
          studyResults = studyResults.map(studyResult =>
            studyResult.id === s.id ? s : studyResult);
          this.studyResultsSubject.next(studyResults);
        })
      )
    } else {
      const selfAssessmentId = this.educationProgramsStore.getSelfAssessmentId()!;
      loadUpdateStudyResult$ = this.studyResultsApi.createStudyResultsInformation(selfAssessmentId, body).pipe(
        map(res => res.data),
        catchError(err => {
          this.toastr.warning('Не вдалося створити запис про програмний результат навчання.');
          return throwError(err);
        }),
        tap(s => {
          studyResults = [...studyResults, s];
          this.studyResultsSubject.next(studyResults);
        })
      )
    }

    this.loading.showLoaderUntilCompleted(loadUpdateStudyResult$)
      .subscribe();
  }

  selectedStudyResult(selectedStudyResult: StudyResult | null) {
    this.selectedStudyResultSubject.next(selectedStudyResult);
  }

  deleteStudyResult(id: string) {
    const loadDeleteStudyResult$ = this.studyResultsApi.deleteStudyResultsInformation(id).pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося видалити інформацію про програмний результат навчання.');
        return throwError(err);
      }),
      tap(() => {
        let studyResults = this.studyResultsSubject.getValue();
        studyResults = studyResults.filter(studyResult => studyResult.id !== id);
        this.studyResultsSubject.next(studyResults);
      })
    );

    this.loading.showLoaderUntilCompleted(loadDeleteStudyResult$)
      .subscribe();
  }

  private setRequestBodyFromForm(formData: any) {
    return new StudyResultInformationRequestBody(
      formData.name,
      formData.isCorresponds,
      formData.componentCorrespondences
    );
  }
}
