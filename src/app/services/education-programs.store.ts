import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';
import {EducationProgram} from '../dto/education_programs/EducationProgram';
import {AccreditationApi} from '../api/accreditation.api';
import {ToastrService} from 'ngx-toastr';
import {tap} from 'rxjs/operators';
import {LoadingService} from './loading.service';
import {
  GeneralInformation,
  ProgramEducationalComponent,
  SelfAssessmentInfo,
  StudyResult,
  TeacherInformation
} from '../dto/self_assessment/SelfAssessmentInfo';
import {ChangedFields, CriteriaUpdateRequestBody} from '../dto/self_assessment/CriteriaUpdateRequestBody';
import {saveAs} from 'file-saver';
import {ROWS_IN_TABLE} from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class EducationProgramsStore {

  private accreditationApi = inject(AccreditationApi);
  private toastr = inject(ToastrService);
  loading = inject(LoadingService);

  private educationProgramsSubject = new BehaviorSubject<EducationProgram[]>([]);
  educationPrograms$: Observable<EducationProgram[]> = this.educationProgramsSubject.asObservable();
  totalPrograms = new BehaviorSubject<number>(0);

  private selfAssessmentInfoSubject = new BehaviorSubject<SelfAssessmentInfo | null>(null);
  selfAssessmentInfo$: Observable<SelfAssessmentInfo | null> = this.selfAssessmentInfoSubject.asObservable();
  generalInformation$: Observable<GeneralInformation | undefined> = this.selfAssessmentInfo$.pipe(
    map(info => info?.generalInformation)
  );

  private activeSectionIdSub$ = new BehaviorSubject<string>('');
  activeSectionId: Observable<string> = this.activeSectionIdSub$.asObservable();

  initialFormValues = new BehaviorSubject<any>({});

  isCreateModalVisibleSub = new BehaviorSubject<boolean>(false);
  isCreateModalVisible$ = this.isCreateModalVisibleSub.asObservable();

  changeCreateModalVisibility(val: boolean) {
    this.isCreateModalVisibleSub.next(val);
  }

  setActiveSection(sectionId: string) {
    this.activeSectionIdSub$.next(sectionId);
  }

  getGeneralInformation(): GeneralInformation {
    return this.selfAssessmentInfoSubject.getValue()?.generalInformation!;
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
      map(res => res.data),
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список освітніх програм');
        return throwError(err);
      }),
      tap(programs => {
        this.educationProgramsSubject.next(programs.data);
        this.totalPrograms.next(programs.totalRecords);
      })
    );

    this.loading.showLoaderUntilCompleted(loadEducationPrograms$)
      .subscribe();
  }

  loadSelfAssessmentInfo(id: string) {
    const loadEducationPrograms$ = this.accreditationApi.fetchSelfAssessmentInfo(id).pipe(
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
    let selfAssessmentInfo = this.selfAssessmentInfoSubject.getValue()!;
    const loadSaveChangedCriteria$ = this.accreditationApi.saveChangedCriteria(id, criteria).pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося зберегти дані');
        return throwError(err);
      }),
      tap(res => {
        this.initialFormValues.next({});
        this.toastr.success(res.message);
        selfAssessmentInfo = res.data
        this.selfAssessmentInfoSubject.next(selfAssessmentInfo);
      })
    );

    this.loading.showLoaderUntilCompleted(loadSaveChangedCriteria$)
      .subscribe();
  }

  deletePrograms(selectedPrograms: EducationProgram[]) {

    let educationPrograms = this.educationProgramsSubject.getValue();

    educationPrograms = educationPrograms.filter(p => !selectedPrograms.includes(p));
    const filteredIds = selectedPrograms.map(obj => obj.id);
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

  generateSelfAssessmentDocument(id: string) {
    const loadGenerateSelfAssessmentDocument$ = this.accreditationApi.generateSelfAssessmentDocument(id).pipe(
      catchError(err => {
        this.toastr.error('Не вдалося згенерувати документ');
        return throwError(err);
      }),
      tap((response) => {
        saveAs(response, id + '.pdf');
      }));

    this.loading.showLoaderUntilCompleted(loadGenerateSelfAssessmentDocument$).subscribe();
  }

  createProgram(formData: any) {
    return this.accreditationApi.createProgram(formData).pipe(
      map(res => res.data),
      catchError(err => {
        this.toastr.warning('Не вдалося створити освітню програму');
        return throwError(err);
      }),
      tap(newProgram => {
        this.loadEducationPrograms(0, ROWS_IN_TABLE);
        this.isCreateModalVisibleSub.next(false);
      })
    );
  }

  uploadGeneralDocument(value: any) {
    let selfAssessmentInfo = this.selfAssessmentInfoSubject.getValue()!;
    const id = this.getSelfAssessmentId()!;
    const loadOploadGeneralDocument$ = this.accreditationApi.uploadGeneralDocument(id, value).pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося завантажити документ');
        return throwError(err);
      }),
      tap(res => {
        this.toastr.success(res.message);
        selfAssessmentInfo = {
          ...selfAssessmentInfo,
          generalInformation: {
            ...selfAssessmentInfo.generalInformation,
            educationProgramDocuments: res.data
          }
        }
        this.selfAssessmentInfoSubject.next(selfAssessmentInfo);
        this.initialFormValues.next({});
      })
    );

    this.loading.showLoaderUntilCompleted(loadOploadGeneralDocument$)
      .subscribe();
  }

  downloadFile(id: string, name: string) {
    this.accreditationApi.downloadFile(id).subscribe((response) => {
      saveAs(response, name)
    }, () => {
      this.toastr.error('Не вдалося завантажити файл');
    });
  }
}
