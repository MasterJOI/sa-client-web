import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of} from 'rxjs';
import {FormsApi} from '../api/forms.api';
import {ToastrService} from 'ngx-toastr';
import {Speciality} from '../dto/speciality/Speciality';
import {LoadingService} from './loading.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class SpecialityService {

  private specialitiesSubject = new BehaviorSubject<Speciality[]>([]);
  specialities$: Observable<Speciality[]> = this.specialitiesSubject.asObservable();

  private loading = inject(LoadingService);
  private formsApi = inject(FormsApi);
  private toastr = inject(ToastrService);


  getSpecialities() {
    this.specialities$ = this.formsApi.getSpecialities().pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список спеціальностей');
        return of([]);
      }),
      tap((res) => this.specialitiesSubject.next(res))
    );

    this.loading.showLoaderUntilCompleted(this.specialities$)
      .subscribe();
  }
}
