import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  EducationProgramDocument,
  EducationStatistic,
  GeneralInformation
} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GeneralService} from './general.service';
import {FormArray, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators} from '@angular/forms';
import {BaseControlDirective} from '../base-control.directive';
import {DynamicValidatorMessage} from '../../../../../forms/error/dynamic-validator-message.directive';
import {DropdownModule} from 'primeng/dropdown';
import {documentTypes, programForms} from '../../../../../util/constants';
import {ButtonComponent} from '../../../../../components/button/button.component';
import {SubdivisionsService} from '../../../../../services/subdivisions.service';
import {catchError, of} from 'rxjs';
import {FormsApi} from '../../../../../api/forms.api';
import {ToastrService} from 'ngx-toastr';
import {MultiSelectModule} from 'primeng/multiselect';
import {CheckboxModule} from 'primeng/checkbox';
import {LanguagesService} from '../../../../../services/languages.service';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {
  ProgramComponentInformationService
} from '../t1-program-components-information/program-component-information.service';
import {fileValidator} from '../../../../../forms/validators/file.validator';
import {InitFormDirective} from '../init-form.directive';
import {EducationProgramsStore} from '../../../../../services/education-programs.store';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicValidatorMessage, DropdownModule, ButtonComponent, MultiSelectModule, CheckboxModule, SaFormTextareaComponent, InitFormDirective],
  template: `
    <div [formGroup]="generalInformation"
         initForm formName="general"
         class="flex flex-col gap-8 general">

      <div class="flex flex-col gap-2">
        <h2 class="pl-3 text-title font-light">Інформація про ЗВО</h2>
        <hr>
        <div class="form-field">
          <label for="heiId">Реєстраційний номер ЗВО у ЄДЕБО</label>
          <input formControlName="heiId" type="number" id="heiId">
        </div>
        <ng-container *ngIf="general?.higherEducationInstitutionInformation as hei">
          <table>
            <colgroup>
              <col class="w-1/2">
              <col class="w-1/2">
            </colgroup>
            <tbody>
            <tr class="bg-primary-50">
              <th>Повна назва ЗВО</th>
              <td>{{hei.higherEducationalInstitutionName}}</td>
            </tr>
            <tr>
              <th>Ідентифікаційний код ЗВО</th>
              <td>{{hei.institutionCode}}</td>
            </tr>
            <tr class="bg-primary-50">
              <th>ПІБ керівника ЗВО</th>
              <td>{{hei.headFullName}}</td>
            </tr>
            <tr>
              <th>Посилання на офіційний веб-сайт ЗВО</th>
              <td><a [href]="hei.website" target="_blank">{{hei.website}}</a></td>
            </tr>
            </tbody>
          </table>
          <a class="px-3" [href]="'https://registry.edbo.gov.ua/university/' + hei.heiId" target="_blank">
            Посилання на інформацію про ЗВО (ВСП ЗВО) у Реєстрі суб’єктів освітньої діяльності ЄДЕБО
          </a>
        </ng-container>
      </div>

      <div class="flex flex-col gap-2">
        <h2 class="pl-3 text-title font-light">Загальна інформація про освітню програму, яка подається на
          акредитацію</h2>
        <hr>
        <div class="form-field">
          <label for="educationProgramId">ID освітньої програми в ЄДЕБО</label>
          <input formControlName="educationProgramId" type="number" id="educationProgramId">
        </div>
        <ng-container
          *ngIf="general?.educationProgramAccreditationInformation as accreditationInformation">
          <table>
            <colgroup>
              <col class="w-1/2">
              <col class="w-1/2">
            </colgroup>
            <tbody>
            <tr class="bg-primary-50">
              <th>Повна назва ОП</th>
              <td>{{accreditationInformation.educationProgramName}}</td>
            </tr>
            <tr>
              <th>Реквізити рішення про ліцензування спеціальності на відповідному рівні вищої освіти</th>
              <td>{{accreditationInformation.specialtyLicensingInfo}}</td>
            </tr>
            <tr class="bg-primary-50">
              <th>Цикл (рівень вищої освіти)</th>
              <td>{{accreditationInformation.cycle}}</td>
            </tr>
            <tr>
              <th>Галузь знань</th>
              <td>{{accreditationInformation.fieldOfStudyCode}} {{accreditationInformation.fieldOfStudy}}</td>
            </tr>
            <tr class="bg-primary-50">
              <th>Спеціальність</th>
              <td>{{accreditationInformation.specialtyCode}} {{accreditationInformation.specialty}}</td>
            </tr>
            <tr>
              <th>Спеціалізація</th>
              <td>{{accreditationInformation.specialization ?? '-'}}</td>
            </tr>
            <tr class="bg-primary-50">
              <th>Тип освітньої програми</th>
              <td>{{accreditationInformation.programType}}</td>
            </tr>
            <tr>
              <th>Вступ на освітню програму здійснюється на основі ступеня (рівня)</th>
              <td>{{accreditationInformation.admissionDegree}}</td>
            </tr>
            </tbody>
          </table>
        </ng-container>

        <div class="flex items-center">
          <h2 class="pl-3 text-title font-light w-full">Форми здобуття освіти на ОП</h2>
          <app-button
            classes="button--primary h-[41px]"
            (onCLick)="addProgramForm()"
          >
            <div class="flex justify-center items-center gap-2">
              <img
                src="assets/icons/ic_add.svg"
                alt="Add program form">
            </div>
          </app-button>
        </div>
        <hr>

        <div formArrayName="educationProgramForms" class="space-y-2">
          <div class="flex items-end w-full gap-2.5"
               *ngFor="let educationProgramForms of educationProgramForms.controls; index as i"
               [formGroupName]="i"
          >
            <div class="form-field w-full">
              <label for="form-{{i}}">Форма здобуття освіти на ОП</label>
              <p-dropdown id="form-{{i}}"
                          styleClass="w-full"
                          [options]="programForms"
                          formControlName="educationProgramForm"
                          optionLabel="label"
                          optionValue="label"
              ></p-dropdown>
            </div>
            <div class="form-field w-full">
              <label for="duration">Термін навчання</label>
              <input formControlName="duration" type="text" id="duration">
            </div>
            <app-button
              classes="button--danger h-[41px] {{educationProgramForms.value.length < 2 ? 'button--disabled' : ''}}"
              (onCLick)="removeProgramForm(i)"
            >
              <div class="flex justify-center items-center gap-2">
                <img
                  src="assets/icons/ic_cross.svg"
                  alt="Remove program form">
              </div>
            </app-button>
          </div>
        </div>

        <div class="form-field w-full" *ngIf="(subdivisions$ | async) as subdivisions">
          <label for="subdivisionId">Структурний підрозділ (кафедра або інший підрозділ), відповідальний за
            реалізацію
            ОП</label>
          <p-dropdown id="subdivisionId"
                      styleClass="w-full"
                      [options]="subdivisions"
                      formControlName="subdivisionId"
                      optionLabel="name"
                      optionValue="id"
          ></p-dropdown>
          <div class="form-field">
            <label for="otherSubdivisionsIds">Інші навчальні структурні підрозділи (кафедра або інші підрозділи),
              залучені до
              реалізації ОП</label>
            <p-multiSelect id="otherSubdivisionsIds"
                           styleClass="w-full"
                           [options]="subdivisions"
                           formControlName="otherSubdivisionsIds"
                           optionLabel="name"
                           optionValue="id"
                           display="chip"
            ></p-multiSelect>
          </div>
        </div>

        <app-sa-form-textarea
          label="Місце (адреса) провадження освітньої діяльності за ОП"
          controlKey="location"
          [noAdvice]="true"
          [noCounter]="true"
        ></app-sa-form-textarea>
        <div class="form-field flex-row pl-3">
          <p-checkbox formControlName="grantsProfessionalQualification" [binary]="true"
                      id="grantsProfessionalQualification"></p-checkbox>
          <label for="grantsProfessionalQualification">
            Освітня програма передбачає присвоєння професійної кваліфікації
          </label>
        </div>
        <div class="form-field">
          <label for="professionalQualification">Професійна кваліфікація, яка присвоюється за ОП</label>
          <input
            formControlName="professionalQualification"
            type="text"
            id="professionalQualification"
          >
        </div>
        <div class="form-field" *ngIf="(languages$ | async) as languages">
          <label for="languagesIds">Мова (мови) викладання</label>
          <p-multiSelect id="languagesIds"
                         styleClass="w-full"
                         [options]="languages"
                         formControlName="languagesIds"
                         optionLabel="name"
                         optionValue="id"
                         display="chip"
          ></p-multiSelect>
        </div>
        <div class="form-field">
          <label for="partnerHei">Партнерський заклад (якщо програма реалізовується у співпраці з іншим закладом
            вищої освіти</label>
          <input formControlName="partnerHei" type="text" id="partnerHei">
        </div>

        <div class="form-field">
          <label for="guaranteeId">ID гаранта ОП у ЄДЕБО</label>
          <input formControlName="guaranteeId" type="number" id="guaranteeId">
        </div>
        <ng-container *ngIf="general?.educationProgramAccreditationInformation?.guarantee as guarantee">
          <table>
            <colgroup>
              <col class="w-1/2">
              <col class="w-1/2">
            </colgroup>
            <tbody>
            <tr class="bg-primary-50">
              <th>ПІБ гаранта ОП</th>
              <td>{{guarantee.name}}</td>
            </tr>
            <tr>
              <th>Посада гаранта ОП</th>
              <td>{{guarantee.teacherPosition}}</td>
            </tr>
            <tr class="bg-primary-50">
              <th>Корпоративна електронна адреса гаранта ОП</th>
              <td>{{guarantee.guaranteeEmail}}</td>
            </tr>
            <tr>
              <th>Контактний телефон гаранта ОП</th>
              <td>{{guarantee.guaranteePhone}}</td>
            </tr>
            <tr class="bg-primary-50">
              <th>Додатковий телефон гаранта ОП</th>
              <td>{{guarantee.additionalPhone}}</td>
            </tr>
            </tbody>
          </table>
        </ng-container>
      </div>

      <div class="flex flex-col gap-2">
        <h2 class="pl-3 text-title font-light">Загальні відомості про ОП, історію її розроблення та впровадження</h2>
        <hr>
        <app-sa-form-textarea
          label="Загальні відомості"
          controlKey="historyAndDevelopment"
          [noAdvice]="true"
          [noCounter]="true"
        ></app-sa-form-textarea>
      </div>

      <!--<div formArrayName="educationStatistic">
        <h2 class="pl-3 text-title font-light">Інформація про контингент здобувачів вищої освіти на ОП станом на 1
          жовтня поточного навчального року у розрізі форм здобуття освіти та набір на ОП (кількість здобувачів,
          зарахованих на навчання у відповідному навчальному році сумарно за усіма формами здобуття освіти)</h2>
        <hr>
          <table>
            <thead>
            <tr>
              <th></th>
              <th *ngFor="let year of studyCourseUears">{{ year }}</th>
            </tr>
            </thead>
            <tbody>
            <ng-container *ngFor="let field of statisticFields">
              <tr>
                <td>{{ field }}</td>
                <ng-container *ngFor="let year of studyCourseUears">
                  <td>{{ getCellValue(year, field) }}</td>
                </ng-container>
              </tr>
            </ng-container>
            </tbody>
          </table>
      </div>-->

      <div class="flex flex-col gap-2">
        <div class="flex items-center">
          <h2 class="pl-3 text-title font-light w-full">Поля для завантаження загальних документів</h2>
          <app-button
            classes="button--primary h-[41px]"
            (onCLick)="addProgramDocument()"
          >
            <div class="flex justify-center items-center gap-2">
              <img
                src="assets/icons/ic_add.svg"
                alt="Add program document">
            </div>
          </app-button>
        </div>
        <hr>
        <div formArrayName="educationProgramDocuments" class="space-y-2">
          <div class="flex items-end w-full gap-2.5"
               *ngFor="let document of educationProgramDocuments.controls; index as i"
               [formGroupName]="i"
          >
            <div class="form-field">
              <label for="name">Тип документу</label>
              <p-dropdown id="type"
                          styleClass="w-full"
                          [options]="documentTypes"
                          formControlName="type"
                          optionLabel="label"
                          optionValue="value"
              ></p-dropdown>
            </div>
            <ng-container *ngIf="document.getRawValue().name">
              <div class="form-field w-full">
                <label for="name">Поточний файл</label>
                <div class="flex gap-2">
                  <input
                    formControlName="name"
                    type="text"
                    readonly
                  >
                  <app-button
                    *ngIf="document.value.path"
                    classes="button--dark h-full"
                    (onCLick)="downloadFile(document.value.id, document.value.name)"
                  >
                    <img
                      style="filter: invert(100%) sepia(0%) saturate(7434%) hue-rotate(21deg) brightness(119%) contrast(105%);"
                      width="16px"
                      height="16px"
                      src="assets/icons/ic_download.svg"
                      alt="Download file">
                  </app-button>
                </div>
              </div>
            </ng-container>
            <ng-container *ngIf="!document.value.path">
              <div class="form-field">
                <label class="reusable-button button--outlined h-[41px]">
                  <input #fileInput
                         type="file"
                         (click)="fileInput.value = ''"
                         (change)="onFileChange($event, i)"
                         accept=".doc,.docx,.pdf"
                         required
                         class="hidden"
                  />
                  Обрати файл
                </label>
              </div>
              <app-button
                *ngIf="document.value.file"
                classes="button--primary h-[41px]"
                (onCLick)="uploadProgramDocument(document.value)"
              >
                <div class="flex justify-center items-center gap-2">
                  <img
                    src="assets/icons/ic_add.svg"
                    alt="Upload document">
                  <p class="text-gray-950 text-title">Завантажити документ</p>
                </div>
              </app-button>
            </ng-container>
            <app-button
              classes="button--danger h-[41px] {{educationProgramDocuments.value.length < 2 ? 'button--disabled' : ''}}"
              (onCLick)="removeProgramDocument(i)"
            >
              <div class="flex justify-center items-center gap-2">
                <img
                  src="assets/icons/ic_cross.svg"
                  alt="Remove program document">
              </div>
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralComponent extends BaseControlDirective implements OnInit {

  private destroyRef = inject(DestroyRef);
  private generalService = inject(GeneralService);
  private educationProgramsStore = inject(EducationProgramsStore);
  private subdivisionsService = inject(SubdivisionsService);
  private languageService = inject(LanguagesService);
  private componentInformationService = inject(ProgramComponentInformationService);
  private formsApi = inject(FormsApi);
  private toastr = inject(ToastrService);

  @ViewChild(InitFormDirective)
  private initFormDirective!: InitFormDirective

  protected subdivisions$ = this.subdivisionsService.subdivisions$;
  protected languages$ = this.languageService.languages$;
  general: GeneralInformation | null = null;

  constructor() {
    super();
    this.parentFormGroup.addControl('general',
      this.fb.nonNullable.group({
        heiId: [{value: '', disabled: true}],
        educationProgramId: [{value: '', disabled: true}],
        educationProgramForms: this.fb.nonNullable.array([
          this.fb.group({
            educationProgramForm: [''],
            duration: [''],
          })
        ]),
        grantsProfessionalQualification: [false],
        professionalQualification: [''],
        subdivisionId: [''],
        otherSubdivisionsIds: [''],
        partnerHei: [''],
        guaranteeId: [{value: '', disabled: true}],
        languagesIds: ['', Validators.required],
        location: [''],
        historyAndDevelopment: [''],
        educationStatistic: this.fb.array([]),
        educationProgramDocuments: this.fb.array([]),
      }));
  }

  get generalInformation() {
    return this.parentFormGroup.get('general') as FormGroup;
  }

  get educationProgramForms() {
    return this.generalInformation.get('educationProgramForms') as FormArray;
  }

  get educationProgramDocuments() {
    return this.generalInformation.get('educationProgramDocuments') as FormArray;
  }

  get educationStatistic() {
    return this.generalInformation.get('educationStatistic') as FormArray;
  }

  /*get studyCourseUears() {
    return  Array.from(new Set(this.general?.educationStatistic.map(stat => stat.studyCourseYear)));
  }

  getCellValue(year: number, field: string) {
    const stat = this.general!.educationStatistic.find(s => s.studyCourseYear === year);
    // @ts-ignore
    return stat ? stat[field] : '';
  }

  get statisticFields() {
    return  Object.keys(this.general!.educationStatistic[0]).filter(field => field !== 'studyCourseYear');
  }*/

  ngOnInit() {
    this.subdivisions$ = this.formsApi.getSubdivisions().pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список підрозділів');
        return of([]);
      }),
    );

    this.languages$ = this.formsApi.getLanguages().pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список мов');
        return of([]);
      }),
    );

    this.generalInformation.get('grantsProfessionalQualification')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      const control = this.generalInformation.get('professionalQualification');
      value ? control?.enable() : control?.disable();

    });

    this.educationProgramsStore.generalInformation$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(general => {
      if (general) {
        this.general = general;
        const accreditationInfo = general.educationProgramAccreditationInformation;

        this.generalInformation.patchValue({
          heiId: general.higherEducationInstitutionInformation.heiId,
          educationProgramId: accreditationInfo.educationProgramId,
          grantsProfessionalQualification: accreditationInfo.grantsProfessionalQualification,
          professionalQualification: accreditationInfo.professionalQualification,
          subdivisionId: accreditationInfo.subdivisionId,
          otherSubdivisionsIds: accreditationInfo.otherSubdivisions.map(s => s.id),
          partnerHei: accreditationInfo.partnerHei,
          guaranteeId: accreditationInfo.guarantee.teacherId,
          languagesIds: accreditationInfo.languages.map(l => l.id),
          location: accreditationInfo.location,
          historyAndDevelopment: accreditationInfo.historyAndDevelopment,
          higherEducationInstitutionArea: general.higherEducationInstitutionArea,
        });

        this.patchEducationProgramForms(
          general.educationProgramAccreditationInformation.duration,
          general.educationProgramAccreditationInformation.educationProgramForms
        );

        this.patchEducationStatistic(general.educationStatistic);
        this.patchEducationProgramDocuments(general.educationProgramDocuments);

        if (this.initFormDirective) {
          this.initFormDirective.setInitialFormValues();
        }
      }
    });
  }

  patchEducationProgramForms(durationArr: string[], educationProgramFormsArr: string[]) {
    this.educationProgramForms.clear();

    for (let i = 0; i < educationProgramFormsArr.length; i++) {
      const duration = durationArr[i] || '';
      const educationProgramForm = educationProgramFormsArr[i] || '';

      const group = this.fb.group({
        duration: [duration],
        educationProgramForm: [educationProgramForm],
      });

      this.educationProgramForms.push(group);
    }
  }

  addProgramForm() {
    const group = this.fb.group({
      duration: [''],
      educationProgramForm: [programForms[0].value],
    });

    this.educationProgramForms.push(group);
  }

  removeProgramForm(index: number) {
    this.educationProgramForms.removeAt(index);
  }

  patchEducationStatistic(educationStatistic: EducationStatistic[]) {
    const educationStatisticArray = this.generalInformation.get('educationStatistic') as FormArray;
    educationStatisticArray.clear();

    educationStatistic.forEach((statistic) => {
      const group = this.fb.group({
        studyCourseYear: [statistic.studyCourseYear],
        academicYear: [statistic.academicYear],
        enrollment: [statistic.enrollment],
        fullTime: [statistic.fullTime],
        evening: [statistic.evening],
        partTime: [statistic.partTime],
        foreignFullTime: [statistic.foreignFullTime],
        foreignEvening: [statistic.foreignEvening],
        foreignPartTime: [statistic.foreignPartTime],
      });

      educationStatisticArray.push(group);
    });
  }

  patchEducationProgramDocuments(educationProgramDocuments: EducationProgramDocument[]) {
    const educationProgramDocumentsArray = this.generalInformation.get('educationProgramDocuments') as FormArray;
    educationProgramDocumentsArray.clear();

    educationProgramDocuments.forEach((document) => {
      const group = this.fb.group({
        id: [document.id],
        type: [documentTypes.find(t => t.label === document.type)?.value],
        name: [document.name],
        path: [document.path],
        file: new UntypedFormControl('', [Validators.required, fileValidator])
      });

      educationProgramDocumentsArray.push(group);
    });
  }

  addProgramDocument() {
    const group = this.fb.group({
      id: [null],
      type: [documentTypes[0].value],
      name: [''],
      path: [''],
      file: new UntypedFormControl('', [Validators.required, fileValidator])
    });

    this.educationProgramDocuments.push(group);
  }

  removeProgramDocument(index: number) {
    this.educationProgramDocuments.removeAt(index);
  }

  onFileChange(event: Event, index: number) {
    const element = event.currentTarget as HTMLInputElement;
    let files = element.files;
    if (files && files.length > 0) {
      const formGroup = this.educationProgramDocuments.at(index) as FormGroup;
      formGroup.patchValue({
        name: files.item(0)!.name,
        file: files.item(0)
      });
    }
  }

  downloadFile(id: string, name: string) {
    this.educationProgramsStore.downloadFile(
      id,
      name
    );
  }

  protected readonly programForms = programForms;
  protected readonly documentTypes = documentTypes;

  uploadProgramDocument(value: any) {
    this.educationProgramsStore.uploadGeneralDocument(value);
  }
}
