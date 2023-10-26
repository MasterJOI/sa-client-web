import {inject, Injectable, OnInit} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {FormsApi} from '../api/forms.api';
import {ToastrService} from 'ngx-toastr';
import {Language} from '../dto/language/Lanugage';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService implements OnInit {

  languages$!: Observable<Language[]>;

  private formsApi = inject(FormsApi);
  private toastr = inject(ToastrService);

  ngOnInit() {
    this.languages$ = this.formsApi.getLanguages().pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список мов');
        return of([]);
      }),
    );
  }
}
