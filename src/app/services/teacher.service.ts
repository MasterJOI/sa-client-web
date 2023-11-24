import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of} from 'rxjs';
import {FormsApi} from '../api/forms.api';
import {ToastrService} from 'ngx-toastr';
import {LoadingService} from './loading.service';
import {tap} from 'rxjs/operators';
import {Teacher} from '../dto/teacher/Teacher';

@Injectable()
export class TeacherService {

  private teachersSubject = new BehaviorSubject<Teacher[]>([]);
  teachers$: Observable<Teacher[]> = this.teachersSubject.asObservable();

  private loading = inject(LoadingService);
  private formsApi = inject(FormsApi);
  private toastr = inject(ToastrService);


  getTeachers() {
    this.teachers$ = this.formsApi.getTeachers().pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список викладачів');
        return of([]);
      }),
      tap((res) => this.teachersSubject.next(res))
    );

    this.loading.showLoaderUntilCompleted(this.teachers$)
      .subscribe();
  }
}
