import {inject} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LoadingService} from '../../../../../services/loading.service';
import {ToastrService} from 'ngx-toastr';
import {TeacherInformation} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {UserApi} from '../../../../../api/user.api';
import {EducationProgramsStore} from '../../../../../services/education-programs.store';
import {TeacherInformationRequestBody} from '../../../../../dto/self_assessment/tables/TeacherInformationRequestBody';
import {TeachersInformationApi} from '../../../../../api/teachers-information.api';
import {QuestionnaireAnalysis} from '../../../../../dto/questionnaire_analysis/QuestionnaireAnalysis';
import {TeacherAnalyzerApi} from '../../../../../api/teacher-analyzer.api';
import {MessageService} from 'primeng/api';

export class TeacherSummaryService {

  private loading = inject(LoadingService);
  private toastr = inject(ToastrService);
  private userApi = inject(UserApi);
  private teacherAnalyzerApi = inject(TeacherAnalyzerApi);
  private educationProgramsStore = inject(EducationProgramsStore);
  private teachersInformationApi = inject(TeachersInformationApi);
  private messageService = inject(MessageService);

  private teachersSubject = new BehaviorSubject<TeacherInformation[]>([]);
  teachers$: Observable<TeacherInformation[]> = this.teachersSubject.asObservable();

  private selectedTeacherSubject = new BehaviorSubject<TeacherInformation | null>(null);
  selectedTeacher$: Observable<TeacherInformation | null> = this.selectedTeacherSubject.asObservable();

  private searchedTeacherSubject = new BehaviorSubject<TeacherInformation | null>(null);
  searchedTeacher$: Observable<TeacherInformation | null> = this.searchedTeacherSubject.asObservable();

  private questionnaireAnalysisSubject = new BehaviorSubject<QuestionnaireAnalysis | null>(null);
  questionnaireAnalysis$: Observable<QuestionnaireAnalysis | null> = this.questionnaireAnalysisSubject.asObservable();

  constructor() {
    this.teachersSubject.next(this.educationProgramsStore.getTeachersInformation());
  }

  sendTeacherForm(isEditable: boolean, teacherForm: any) {
    let teachers = this.teachersSubject.getValue();
    let selectedTeacher = this.selectedTeacherSubject.getValue();
    const teacherId = this.selectedTeacherSubject.getValue()!.teacherId;
    let loadUpdateTeachers$: Observable<any>;

    const body = new TeacherInformationRequestBody(
      teacherId,
      teacherForm.teacherQualification,
      teacherForm.teacherExperience,
      teacherForm.rationale,
      teacherForm.disciplines.map((d: { id: string }) => d.id)
    );

    if (isEditable) {
      loadUpdateTeachers$ = this.teachersInformationApi.updateTeacherInformation(selectedTeacher!.id, body).pipe(
        map(res => res.data),
        catchError(err => {
          this.toastr.warning('Не вдалося оновити інформацію про викладача.');
          return throwError(err);
        }),
        tap(t => {
          teachers = teachers.map(teacher =>
            teacher.id === t.id ? t : teacher);
          this.teachersSubject.next(teachers);
        })
      )
    } else {
      const selfAssessmentId = this.educationProgramsStore.getSelfAssessmentId()!;
      loadUpdateTeachers$ = this.teachersInformationApi.createTeacherInformation(selfAssessmentId, body).pipe(
        map(res => res.data),
        catchError(err => {
          this.toastr.warning('Не вдалося створити запис про викадача.');
          return throwError(err);
        }),
        tap(t => {
          teachers = [...teachers, t];
          this.teachersSubject.next(teachers);
        })
      )
    }

    this.loading.showLoaderUntilCompleted(loadUpdateTeachers$)
      .subscribe();
  }

  searchTeacherByName(q: string) {
    const loadSearchTeacherByName$ = this.userApi.searchTeacherByName(q).pipe(
      catchError(err => {
        this.toastr.warning(err.error.message);
        return throwError(err);
      }),
      tap(teacher => this.searchedTeacherSubject.next(teacher))
    );

    this.loading.showLoaderUntilCompleted(loadSearchTeacherByName$)
      .subscribe();
  }

  searchTeacherByQuestionnaireName(name: string, q: QuestionnaireAnalysis) {
    const loadSearchTeacherByName$ = this.userApi.searchTeacherByName(name).pipe(
      catchError(err => {
        this.toastr.warning(err.error.message);
        return throwError(err);
      }),
      tap(teacher => {
        teacher = {
          ...teacher,
          teacherQualification: q.qualification,
          teacherExperience: q.experienceInYears,
          rationale: q.adocument.justification.join()
        };
        this.searchedTeacherSubject.next(teacher);
      })
    );

    this.loading.showLoaderUntilCompleted(loadSearchTeacherByName$)
      .subscribe();
  }

  updateSearchedTeacher(value: TeacherInformation | null) {
    this.searchedTeacherSubject.next(value);
  }

  selectedTeacher(selectedTeacher: TeacherInformation | null) {
    this.selectedTeacherSubject.next(selectedTeacher);
  }

  deleteTeacherInformation(id: string) {
    const loadDeleteTeacherInformation$ = this.teachersInformationApi.deleteTeacherInformation(id).pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося видалити інформацію про викладача');
        return throwError(err);
      }),
      tap(() => {
        let teachers = this.teachersSubject.getValue();
        teachers = teachers.filter(teacher => teacher.id !== id);
        this.teachersSubject.next(teachers);
      })
    );

    this.loading.showLoaderUntilCompleted(loadDeleteTeacherInformation$)
      .subscribe();
  }

  submitQuestionnaire(questionnaire: File, isEditable: boolean) {
    let teacher = isEditable ? this.selectedTeacherSubject.getValue()! : this.searchedTeacherSubject.getValue()!;
    const speciality = this.educationProgramsStore.getGeneralInformation().educationProgramAccreditationInformation.specialtyCode.toString();
    const loadAnalyzeQuestionnaire$ = this.teacherAnalyzerApi.analyzeQuestionnaire(questionnaire, speciality).pipe(
      catchError(err => {
        this.toastr.warning('Під час аналізу анкети виникла помилка.');
        return throwError(err);
      }),
      tap((q) => {
        if (!q.adocument.passed) {
          this.messageService.add({
            key: 'confirm',
            sticky: true,
            severity: 'warn',
            summary: 'Надана анкета містить помилки!'
          });
        } else {
          if (teacher) {
            teacher = {
              ...teacher,
              teacherQualification: q.qualification,
              teacherExperience: q.experienceInYears,
              rationale: q.adocument.justification.join()
            };
            isEditable ? this.searchedTeacherSubject.next(teacher) : this.selectedTeacherSubject.next(teacher);
            this.toastr.success('Анкета успішно пройшла перевірку.');
          }
        }
        this.questionnaireAnalysisSubject.next(q);
      })
    );

    this.loading.showLoaderUntilCompleted(loadAnalyzeQuestionnaire$)
      .subscribe();
  }
}
