import {inject} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, Subject, throwError} from 'rxjs';
import {Advise} from '../dto/self_assessment/Advise';
import {tap} from 'rxjs/operators';
import {AccreditationApi} from '../api/accreditation.api';
import {ToastrService} from 'ngx-toastr';
import {LoadingService} from './loading.service';
import {EducationProgramsStore} from './education-programs.store';


export class AdviceService {

  private accreditationApi = inject(AccreditationApi);
  private toastr = inject(ToastrService);
  private loading = inject(LoadingService);
  private educationProgramsStore = inject(EducationProgramsStore);

  private selectedInputAdviceSubject = new Subject<Advise | null>();
  selectedInputAdvice$: Observable<Advise | null> = this.selectedInputAdviceSubject.asObservable();

  activeHintControlKey = '';
  isHintHidden$ = new BehaviorSubject<boolean>(true);

  onSelectInputHint(controlKey: string, label: string, maxCharacters: number) {
    if (controlKey === this.activeHintControlKey) {
      this.isHintHidden$.next(true);
      this.activeHintControlKey = '';
      return;
    }
    this.isHintHidden$.next(false);
    const loadAdvice$ = this.accreditationApi.fetchAdvice(label).pipe(
      map(advice => ({...advice, controlKey, maxCharacters})),
      catchError(err => {
        this.toastr.warning('Не вдалося отримати пораду для цього поля');
        return throwError(err);
      }),
      tap(advice => {
        this.selectedInputAdviceSubject.next(advice);
        this.activeHintControlKey = controlKey;
      })
    );

    this.loading.showLoaderUntilCompleted(loadAdvice$)
      .subscribe();
  }

  selectNewSection(sectionId: string) {
    this.activeHintControlKey = '';
    this.isHintHidden$.next(true);
    this.selectedInputAdviceSubject.next(null);
    this.educationProgramsStore.setActiveSection(sectionId);
  }
}
