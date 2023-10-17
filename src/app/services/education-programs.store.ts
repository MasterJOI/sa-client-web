import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';
import {EducationProgram} from '../dto/education_programs/EducationProgram';
import {AccreditationApi} from '../api/accreditation.api';
import {ToastrService} from 'ngx-toastr';
import {tap} from 'rxjs/operators';
import {LoadingService} from './loading.service';
import {
  ProgramEducationalComponent,
  SelfAssessmentInfo, StudyResult,
  TeacherInformation
} from '../dto/self_assessment/SelfAssessmentInfo';
import {ChangedFields, CriteriaUpdateRequestBody} from '../dto/self_assessment/CriteriaUpdateRequestBody';
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class EducationProgramsStore {

  private accreditationApi = inject(AccreditationApi);
  private toastr = inject(ToastrService);
  loading = inject(LoadingService);

  private educationProgramsSubject = new BehaviorSubject<EducationProgram[]>([]);
  educationPrograms$: Observable<EducationProgram[]> = this.educationProgramsSubject.asObservable();

  private selfAssessmentInfoSubject = new BehaviorSubject<SelfAssessmentInfo | null>(null);
  selfAssessmentInfo$: Observable<SelfAssessmentInfo | null> = this.selfAssessmentInfoSubject.asObservable();

  private activeSectionIdSub$ = new BehaviorSubject<string>('');
  activeSectionId:Observable<string> = this.activeSectionIdSub$.asObservable();

  setActiveSection(sectionId: string) {
    this.activeSectionIdSub$.next(sectionId);
  }

  getComponentInformation(): ProgramEducationalComponent[] {
    return this.selfAssessmentInfoSubject.getValue()?.programEducationalComponentsInformation.educationalComponents!;
  }

  getTeachersInformation(): TeacherInformation[] {
    return this.selfAssessmentInfoSubject.getValue()?.teacherSummaryInformation.teachers!;
  }

  getStudyResultsInformation(): StudyResult[] {
    return this.selfAssessmentInfoSubject.getValue()?.studyResultsMatrix.studyResults!;
  }

  loadEducationPrograms(from: number, count: number) {
    const loadEducationPrograms$ = this.accreditationApi.fetchEducationPrograms(from, count).pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список освітніх програм');
        return throwError(err);
      }),
      tap(programs => this.educationProgramsSubject.next(programs))
    );

    this.loading.showLoaderUntilCompleted(loadEducationPrograms$)
      .subscribe();
  }

  loadSelfAssessmentInfo(programId: number) {
    const loadEducationPrograms$ = this.accreditationApi.fetchSelfAssessmentInfo(programId).pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати дані про самооцінювання ОП');
        return throwError(err);
      }),
      tap(selfAssessmentInfo => this.selfAssessmentInfoSubject.next(selfAssessmentInfo))
    );

    this.loading.showLoaderUntilCompleted(loadEducationPrograms$)
      .subscribe();
  }

  saveChangedCriteria(id: string, criteria: ChangedFields<CriteriaUpdateRequestBody>) {
    const loadSaveChangedCriteria$ = this.accreditationApi.saveChangedCriteria(id, criteria).pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося зберегти дані');
        return throwError(err);
      }),
      tap(res => this.toastr.success(res.message))
    );

    this.loading.showLoaderUntilCompleted(loadSaveChangedCriteria$)
      .subscribe();
  }

  deletePrograms(selectedPrograms: EducationProgram[]) {

    let educationPrograms = this.educationProgramsSubject.getValue();

    educationPrograms = educationPrograms.filter(p => !selectedPrograms.includes(p));
    const filteredIds = selectedPrograms.map(obj => obj.educationProgramId);
    const loadDeletePrograms$ = this.accreditationApi.deletePrograms(filteredIds).pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося видалити освітню програму');
        return throwError(err);
      }),
      tap(() => {
        this.toastr.success('Ви успішно видалили освітню програму');
        this.educationProgramsSubject.next(educationPrograms);
      })
    );

    this.loading.showLoaderUntilCompleted(loadDeletePrograms$).subscribe();
  }

  getSelfAssessmentId() {
    return this.selfAssessmentInfoSubject.getValue()?.id;
  }

  generateSelfAssessmentDocument(programId: number) {
    const loadGenerateSelfAssessmentDocument$ = this.accreditationApi.generateSelfAssessmentDocument(programId).pipe(
      catchError(err => {
        this.toastr.error('Не вдалося згенерувати документ');
        return throwError(err);
      }),
      tap((response) => {
        saveAs(response, programId + '.pdf');
    }));

    this.loading.showLoaderUntilCompleted(loadGenerateSelfAssessmentDocument$).subscribe();
  }

  createProgram(formData: any) {
    let programs = this.educationProgramsSubject.getValue();

    const loadCreateProgram$ = this.accreditationApi.createProgram(formData).pipe(
        map(res => res.data),
        catchError(err => {
          this.toastr.warning('Не вдалося створити освітню програму');
          return throwError(err);
        }),
        tap(newProgram => {
          programs = [...programs, newProgram];
          this.educationProgramsSubject.next(programs);
        })
    );

    this.loading.showLoaderUntilCompleted(loadCreateProgram$)
      .subscribe();
  }
}
