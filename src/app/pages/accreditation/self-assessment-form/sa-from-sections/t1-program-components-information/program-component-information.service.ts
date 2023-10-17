import {inject, Injectable} from '@angular/core';
import {EducationProgramsStore} from '../../../../../services/education-programs.store';
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {EducationDiscipline, ProgramEducationalComponent} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {LoadingService} from '../../../../../services/loading.service';
import {
    ComponentInformationRequestBody
} from '../../../../../dto/self_assessment/tables/ComponentInformationRequestBody';
import {ProgramComponentsApi} from '../../../../../api/program-components.api';
import {saveAs} from "file-saver";

@Injectable({
    providedIn: 'root'
})
export class ProgramComponentInformationService {

    private programComponentsSubject = new BehaviorSubject<ProgramEducationalComponent[]>([]);
    programComponents$: Observable<ProgramEducationalComponent[]> = this.programComponentsSubject.asObservable();

    private selectedProgramComponentSubject = new BehaviorSubject<ProgramEducationalComponent | null>(null);
    selectedProgramComponent$: Observable<ProgramEducationalComponent | null> = this.selectedProgramComponentSubject.asObservable();

    private educationProgramsStore = inject(EducationProgramsStore);
    private componentsApi = inject(ProgramComponentsApi);
    private toastr = inject(ToastrService);
    private loading = inject(LoadingService);

    constructor() {
        this.programComponentsSubject.next(this.educationProgramsStore.getComponentInformation());
    }

    getDisciplinesList(): Observable<EducationDiscipline[]> {
        return this.programComponents$
            .pipe(
                map(components => components.map(c => ({
                    id: c.id,
                    name: c.componentName
                })))
            )
    }

    sendComponentForm(isEditable: boolean, id: string | undefined, formData: any) {
        let components = this.programComponentsSubject.getValue();
        let loadUpdateComponentInformation$: Observable<any>;

        const body = this.setRequestBodyFromForm(formData);

        if (isEditable) {
            loadUpdateComponentInformation$ = this.componentsApi.updateComponentInformation(id!, body).pipe(
                map(res => res.data),
                catchError(err => {
                    this.toastr.warning('Не вдалося оновити освітній компонент.');
                    return throwError(err);
                }),
                tap(c => {
                    components = components.map(component =>
                        component.id === id ? c : component);
                    this.programComponentsSubject.next(components);
                })
            )
        } else {
            const selfAssessmentId = this.educationProgramsStore.getSelfAssessmentId()!;
            loadUpdateComponentInformation$ = this.componentsApi.createComponentInformation(selfAssessmentId, body).pipe(
                map(res => res.data),
                catchError(err => {
                    this.toastr.warning('Не вдалося створити освітній компонент.');
                    return throwError(err);
                }),
                tap(c => {
                    components = [...components, c]
                    this.programComponentsSubject.next(components);
                })
            )
        }

        this.loading.showLoaderUntilCompleted(loadUpdateComponentInformation$)
            .subscribe();
    }

    selectedProgramComponent(selectedProgramComponent: ProgramEducationalComponent | null) {
        this.selectedProgramComponentSubject.next(selectedProgramComponent);
    }

    private setRequestBodyFromForm(formData: any) {
        return new ComponentInformationRequestBody(
            formData.componentName,
            formData.componentType,
            formData.specialEquipmentInfo,
            formData.document,
        );
    }

    deleteComponentInformation(id: string) {
        const loadDeleteComponentInformation$ = this.componentsApi.deleteComponentInformation(id).pipe(
            catchError(err => {
                this.toastr.warning('Не вдалося видалити освітній компонент');
                return throwError(err);
            }),
            tap(() => {
                let components = this.programComponentsSubject.getValue();
                components = components.filter(component => component.id !== id);
                this.programComponentsSubject.next(components);
            })
        );

        this.loading.showLoaderUntilCompleted(loadDeleteComponentInformation$)
            .subscribe();
    }

    downloadFile(id: string, name: string) {
        this.componentsApi.downloadFile(id).subscribe((response) => {
            saveAs(response, name)
        }, () => {
            this.toastr.error('Не вдалося завантажити файл');
        });
    }
}
