import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of} from 'rxjs';
import {Subdivision} from '../dto/subdivision/Subdivision';
import {FormsApi} from '../api/forms.api';
import {ToastrService} from 'ngx-toastr';
import {LoadingService} from './loading.service';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubdivisionsService {

  private subject = new BehaviorSubject<Subdivision[]>([]);
  subdivisions$: Observable<Subdivision[]> = this.subject.asObservable();

  private formsApi = inject(FormsApi);
  private toastr = inject(ToastrService);
  private loading = inject(LoadingService);

  constructor() {
    this.loadSubdivisions();
  }

  loadSubdivisions() {
    const loadSubdivisions$ = this.formsApi.getSubdivisions().pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список підрозділів');
        return of([]);
      }),
      tap((res) => this.subject.next(res))
    );

    this.loading.showLoaderUntilCompleted(loadSubdivisions$)
      .subscribe();
  }
}
