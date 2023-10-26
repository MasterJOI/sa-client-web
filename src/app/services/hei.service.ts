import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of} from 'rxjs';
import {FormsApi} from '../api/forms.api';
import {ToastrService} from 'ngx-toastr';
import {LoadingService} from './loading.service';
import {tap} from 'rxjs/operators';
import {Hei} from '../dto/hei/Hei';

@Injectable()
export class HeiService {

  private heisSubject = new BehaviorSubject<Hei[]>([]);
  heis$: Observable<Hei[]> = this.heisSubject.asObservable();

  private loading = inject(LoadingService);
  private formsApi = inject(FormsApi);
  private toastr = inject(ToastrService);


  getHeis() {
    this.heis$ = this.formsApi.getHeis().pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список закладів вищої освіти');
        return of([]);
      }),
      tap((res) => this.heisSubject.next(res))
    );

    this.loading.showLoaderUntilCompleted(this.heis$)
      .subscribe();
  }
}
