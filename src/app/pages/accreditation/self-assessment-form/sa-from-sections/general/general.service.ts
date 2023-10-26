import {inject, Injectable} from '@angular/core';
import {EducationProgramsStore} from '../../../../../services/education-programs.store';
import {BehaviorSubject, Observable} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {GeneralInformation} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {LoadingService} from '../../../../../services/loading.service';

@Injectable({
    providedIn: 'root'
})
export class GeneralService {

    private generalInformationSubject = new BehaviorSubject<GeneralInformation | null>(null);
    generalInformation$: Observable<GeneralInformation | null> = this.generalInformationSubject.asObservable();

    private educationProgramsStore = inject(EducationProgramsStore);
    private toastr = inject(ToastrService);
    private loading = inject(LoadingService);

    constructor() {
        this.generalInformationSubject.next(this.educationProgramsStore.getGeneralInformation());
    }
}
