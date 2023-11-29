import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, UntypedFormControl, Validators} from '@angular/forms';
import {ROWS_IN_TABLE} from 'src/app/util/constants';
import {ButtonComponent} from '../../../../../components/button/button.component';
import {MessageService, SharedModule} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {SidebarModule} from 'primeng/sidebar';
import {PaginatorModule} from 'primeng/paginator';
import {DynamicValidatorMessage} from '../../../../../forms/error/dynamic-validator-message.directive';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {EducationDiscipline, TeacherInformation} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {TeacherSummaryService} from './teacher-summary.service';
import {MultiSelectModule} from 'primeng/multiselect';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ValidatorMessageContainer} from '../../../../../forms/error/input-error/validator-message-container.directive';
import {PageLoaderComponent} from '../../../../../components/page-loader/page-loader.component';
import {LoadingService} from '../../../../../services/loading.service';
import {
  ProgramComponentInformationService
} from '../t1-program-components-information/program-component-information.service';
import {AutoTitleDirective} from '../../../../../directives/auto-title.directive';
import {fileValidator} from '../../../../../forms/validators/file.validator';
import {ToastModule} from 'primeng/toast';
import {SaModalComponent} from '../../../../../components/modals/sa-modal.component';
import {
  AnalysisContentComponent
} from '../../../../../components/modals/contents/analysis-content/analysis-content.component';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-t2-teacher-summary-information',
  standalone: true,
  providers: [
    TeacherSummaryService,
    LoadingService,
    MessageService
  ],
  imports: [CommonModule, ButtonComponent, SharedModule, TableModule, TagModule, SidebarModule, PaginatorModule, ReactiveFormsModule, DynamicValidatorMessage, SaFormTextareaComponent, MultiSelectModule, ValidatorMessageContainer, PageLoaderComponent, AutoTitleDirective, ToastModule, SaModalComponent, AnalysisContentComponent],
  template: `
    <p-table dataKey="id"
             [value]="(teachers$ | async)!"
             [scrollable]="true"
             scrollHeight="500px"
             selectionMode="single"
             [(selection)]="selectedTeacher"
             (selectionChange)="onRowSelect()"
             styleClass="list-table without-actions ui-corner-all"
             responsiveLayout="scroll"
             groupRowsBy="id"
             [rows]="ROWS_IN_TABLE"
             xmlns="http://www.w3.org/1999/html">
      <ng-template pTemplate="caption">
        <div class="flex items-center justify-between gap-2">
          <span class="font-kharkiv-tone text-gray-950 text-xl">Таблиця 2. Зведена інформація про викладачів</span>
          <app-button
            classes="button--primary h-12"
            (onCLick)="onTeacherAdd()"
          >
            <div class="flex justify-center items-center gap-2">
              <img
                src="assets/icons/ic_plus.svg"
                alt="Add program">
              <p class="text-gray-950 text-title">Додати</p>
            </div>
          </app-button>
        </div>
      </ng-template>
      <ng-template pTemplate="header">
        <tr>
          <th>ID</th>
          <th>ПІБ</th>
          <th>Посада</th>
          <th>Стр. п.</th>
          <th>Кваліфікація</th>
          <th>Стаж</th>
          <th>Навч. дисц.</th>
          <th>Обґрунтування</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-teacher let-rowIndex="rowIndex">
        <tr [pSelectableRow]="teacher">
          <td>
            {{teacher.teacherId}}
          </td>
          <td>
            {{teacher.name}}
          </td>
          <td>
            {{teacher.teacherPosition}}
          </td>
          <td>
            {{teacher.subdivision}}
          </td>
          <td>
            {{teacher.teacherQualification}}
          </td>
          <td>
            {{teacher.teacherExperience}}
          </td>
          <td>
            {{getDisciplineNames(teacher.disciplines)}}
          </td>
          <td>
            {{teacher.rationale}}
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-sidebar
      #sidebar
      styleClass="w-[500px]"
      [(visible)]="formVisible"
      [dismissible]="false"
      (onHide)="onHideSidebar()"
      position="right">

      <ng-template pTemplate="header">
        <app-page-loader class="static"></app-page-loader>
      </ng-template>

      <ng-container *ngIf="!isEditable">
        <div class="form-field pb-2.5">
          <label for="searchInput">Пошук викладача за ПІБ</label>
          <div class="flex gap-2">
            <input
              [(ngModel)]="searchValue"
              [errorContainer]="containerDir.container"
              name="searchInput"
              type="text"
              placeholder="Дорогий Ярослав Юрійович"
              aria-label="search"
              required
            >
            <app-button
              classes="button--primary h-full"
              (onCLick)="search()"
            >
              <div class="flex justify-center items-center gap-2">
                <img
                  src="assets/icons/ic_search.svg"
                  alt="Шукати">
              </div>
            </app-button>
          </div>
          <ng-container validatorMessageContainer #containerDir="validatorMessageContainer"></ng-container>
        </div>
      </ng-container>

      <ng-container *ngIf="selectedTeacher">
        <form id="questionnaireForm"
              [formGroup]="questionnaireForm"
              (ngSubmit)="onQuestionnaireFormSubmit()"
              [errorContainer]="containerFileDir.container"
              class="flex flex-col gap-2.5"
        >
          <div class="form-field">
            <label for="questionnaire">Надіслати анкету викладача на перевірку</label>
            <div class="flex justify-between items-center w-full gap-2.5">
              <input #fileInput
                     type="file"
                     name="questionnaire"
                     (click)="fileInput.value = ''"
                     (change)="onFileChange($event)"
                     accept=".doc,.docx,.pdf"
              />
              <app-button
                classes="button--primary h-[42px] w-[44px]"
                type="submit"
                form="questionnaireForm"
              >
                <div class="flex justify-center items-center gap-2">
                  <img
                    class="scale-125"
                    src="assets/icons/ic_import.svg"
                    alt="Upload questionnaire">
                </div>
              </app-button>
            </div>
            <ng-container validatorMessageContainer #containerFileDir="validatorMessageContainer"></ng-container>
          </div>
        </form>
        <form id="teacherForm"
              [formGroup]="teacherForm"
              (ngSubmit)="onTeacherFormSubmit()"
              class="flex flex-col gap-2.5"
        >
          <div class="form-field">
            <label for="teacherId">ID</label>
            <input formControlName="teacherId" type="text" id="teacherId">
          </div>
          <div class="form-field">
            <label for="name">ПІБ</label>
            <input formControlName="name" type="text" id="name">
          </div>
          <div class="form-field">
            <label for="teacherPosition">Посада</label>
            <input formControlName="teacherPosition" type="text" id="teacherPosition">
          </div>
          <div class="form-field">
            <label for="subdivision">Структурний підрозділ</label>
            <input formControlName="subdivision" type="text" id="subdivision">
          </div>
          <app-sa-form-textarea
            label="Кваліфікація викладача"
            controlKey="teacherQualification"
            [noAdvice]="true"
            [noCounter]="true"
            [disabled]="true"
          ></app-sa-form-textarea>
          <div class="form-field">
            <label for="teacherExperience">Стаж науково-педагогічної роботи</label>
            <input formControlName="teacherExperience" type="number" id="teacherExperience" readonly>
          </div>
          <div class="form-field">
            <label for="disciplines">Навчальні дисципліни, що їх викладає викладач на ОП</label>
            <p-multiSelect id="disciplines"
                           styleClass="sidebar-multiselect w-full"
                           [options]="(disciplines$ | async)!"
                           formControlName="disciplines"
                           optionLabel="name"
                           display="chip"
            ></p-multiSelect>
          </div>
          <app-sa-form-textarea
            [noAdvice]="true"
            label="Обґрунтування"
            controlKey="rationale"
            [noCounter]="true"
            [disabled]="true"
          ></app-sa-form-textarea>
          <div class="flex gap-2 justify-between">
            <div class="flex gap-2">
              <app-button
                type="submit"
                form="teacherForm"
                classes="button--primary h-12"
              >
                Зберегти
              </app-button>
              <ng-container *ngIf="isEditable">
                <app-button
                  classes="button--danger h-12"
                  (onCLick)="onTeacherDelete()">
                  Видалити
                </app-button>
              </ng-container>
            </div>
            <app-button
              classes="button--outlined h-12"
              (onCLick)="sidebar.hide()">
              Відмінити
            </app-button>
          </div>
        </form>
      </ng-container>
    </p-sidebar>

    <p-toast position="bottom-center" key="confirm" [baseZIndex]="5000">
      <ng-template let-message pTemplate="message">
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="p-4 md:p-5 text-center">
            <i class="pi pi-exclamation-triangle" style="font-size: 3rem"></i>
            <h3 class="mb-5 text-lg font-normal text-gray-500">{{message.summary}}</h3>
            <app-button
              classes="button--primary h-12"
              (onCLick)="onAnalysisModalOpen()"
            >
              Переглянути результат аналізу
            </app-button>
          </div>
        </div>
      </ng-template>
    </p-toast>

    <app-sa-modal
      [(visible)]="isAnalysisModalVisible"
      [headerTemplate]="analysisHeaderTemplate"
      [contentTemplate]="analysisContentTemplate"
    ></app-sa-modal>

    <ng-template #analysisHeaderTemplate>
      <h2 class="font-kharkiv-tone text-gray-950 text-xl">Результати перевірки анкети</h2>
    </ng-template>

    <ng-template #analysisContentTemplate>
      <ng-container *ngIf="questionnaireAnalysis$ | async as questionnaireAnalysis">
        <app-analysis-content
          [analysis]="questionnaireAnalysis"
        ></app-analysis-content>
      </ng-container>
    </ng-template>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class T2TeacherSummaryInformationComponent implements OnInit {

  protected readonly ROWS_IN_TABLE = ROWS_IN_TABLE;

  private fb = inject(FormBuilder);
  private teacherSummaryService = inject(TeacherSummaryService);
  private componentInformationService = inject(ProgramComponentInformationService);
  private destroyRef = inject(DestroyRef);
  private cd = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private toastr = inject(ToastrService);
  questionnaireAnalysis$ = this.teacherSummaryService.questionnaireAnalysis$;

  formVisible = false;
  isEditable: boolean = false;

  teacherForm = this.fb.nonNullable.group({
    teacherId: [{value: '', disabled: true}],
    name: [{value: '', disabled: true}],
    teacherPosition: [{value: '', disabled: true}],
    subdivision: [{value: '', disabled: true}],
    teacherQualification: [{value: '', disabled: true}],
    teacherExperience: [{value: 0, disabled: true}],
    disciplines: new FormControl<EducationDiscipline[] | null>(null, [Validators.required]),
    rationale: [{value: '', disabled: true}]
  });

  questionnaireForm = this.fb.nonNullable.group({
    questionnaire: new UntypedFormControl('',
      [Validators.nullValidator, Validators.required, fileValidator]),
  });

  isAnalysisModalVisible = false;

  fillTeacherForm() {
    this.teacherForm.patchValue({
      teacherId: this.selectedTeacher?.teacherId,
      name: this.selectedTeacher?.name,
      teacherPosition: this.selectedTeacher?.teacherPosition,
      subdivision: this.selectedTeacher?.subdivision,
      teacherQualification: this.selectedTeacher?.teacherQualification,
      teacherExperience: this.selectedTeacher?.teacherExperience,
      rationale: this.selectedTeacher?.rationale,
      disciplines: this.selectedTeacher?.disciplines
    });
    this.teacherSummaryService.selectedTeacher(this.selectedTeacher);
  }

  teachers$ = this.teacherSummaryService.teachers$;
  disciplines$ = this.componentInformationService.getDisciplinesList();
  selectedTeacher: TeacherInformation | null = null;

  searchValue = '';

  ngOnInit() {

    this.teacherSummaryService.selectedTeacher$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(t => this.selectedTeacher = t);

    this.teacherSummaryService.searchedTeacher$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(teacher => {
        this.selectedTeacher = teacher;
        this.fillTeacherForm();
        this.cd.markForCheck();
      }
    );
  }

  onRowSelect() {
    this.isEditable = true;
    this.formVisible = true;
    this.fillTeacherForm();
  }

  onTeacherFormSubmit() {

    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      this.cd.markForCheck();
      return;
    }

    if (!this.areAllFieldsFilled()) {
      this.toastr.warning(
        'Завантажте анкету викладача для заповнення відсутніх полів.',
        'У цього викладача заповнені не всі поля!');
      return;
    }

    this.teacherSummaryService.sendTeacherForm(
      this.isEditable,
      this.teacherForm.getRawValue()!);

    this.onHideSidebar();
  }

  areAllFieldsFilled(): boolean {
    for (const controlName in this.teacherForm.controls) {
      if (this.teacherForm.controls.hasOwnProperty(controlName)) {
        const control = this.teacherForm.get(controlName);
        if (control && (control.value === '' || control.value === null)) {
          return false;
        }
      }
    }
    return true;
  }

  onTeacherAdd() {
    this.isEditable = false;
    this.formVisible = true;
  }

  onHideSidebar() {
    this.formVisible = false;
    this.isEditable = false;
    this.searchValue = '';
    this.teacherSummaryService.selectedTeacher(null);
    this.teacherForm.reset();
    this.questionnaireForm.reset();
  }

  onTeacherDelete() {
    this.teacherSummaryService.deleteTeacherInformation(this.selectedTeacher!.id);
    this.onHideSidebar();
  }

  getDisciplineNames(disciplines: EducationDiscipline[]) {
    return disciplines.map(discipline => discipline.name).join(', ');
  }

  onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let files = element.files;
    if (files && files.length > 0) {
      this.questionnaireForm.patchValue({
        questionnaire: files.item(0)
      });
    }
  }

  search() {
    if (this.searchValue === '') {
      this.teacherSummaryService.updateSearchedTeacher(null);
      return;
    }

    this.teacherSummaryService.searchTeacherByName(this.searchValue);
  }

  onQuestionnaireFormSubmit() {
    if (this.questionnaireForm.valid) {
      this.teacherSummaryService.submitQuestionnaire(this.questionnaireForm.get('questionnaire')?.value, this.isEditable);
    }
  }

  onAnalysisModalOpen() {
    this.isAnalysisModalVisible = true;
    this.messageService.clear('confirm');
  }
}
