import {inject, Injectable, OnInit} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {Subdivision} from '../dto/subdivision/Subdivision';
import {FormsApi} from '../api/forms.api';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SubdivisionsService implements OnInit {

  subdivisions$!: Observable<Subdivision[]>;

  private formsApi = inject(FormsApi);
  private toastr = inject(ToastrService);

  ngOnInit() {
    this.subdivisions$ = this.formsApi.getSubdivisions().pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список підрозділів');
        return of([]);
      }),
    );
  }
}
