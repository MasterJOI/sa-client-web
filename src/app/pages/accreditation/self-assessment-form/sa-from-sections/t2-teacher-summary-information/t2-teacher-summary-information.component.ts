import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ROWS_IN_TABLE} from 'src/app/util/constants';
import {ButtonComponent} from '../../../../../components/button/button.component';
import {SharedModule} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {SidebarModule} from 'primeng/sidebar';
import {PaginatorModule} from 'primeng/paginator';
import {DynamicValidatorMessage} from '../../../../../forms/error/dynamic-validator-message.directive';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {
  EducationDiscipline,
  ProgramEducationalComponent,
  TeacherInformation
} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
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

@Component({
  selector: 'app-t2-teacher-summary-information',
  standalone: true,
  providers: [
    TeacherSummaryService,
    LoadingService
  ],
  imports: [CommonModule, ButtonComponent, SharedModule, TableModule, TagModule, SidebarModule, PaginatorModule, ReactiveFormsModule, DynamicValidatorMessage, SaFormTextareaComponent, MultiSelectModule, ValidatorMessageContainer, PageLoaderComponent, AutoTitleDirective],
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

        <app-page-loader></app-page-loader>

        <ng-container *ngIf="!isEditable">
          <div class="form-field pb-2.5">
            <label for="option">Пошук викладача за ПІБ</label>
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
              label="Кваліфікація викладача"
              controlKey="teacherQualification"
              [noAdvice]="true"
              [noCounter]="true"
              [disabled]="true"
            ></app-sa-form-textarea>
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
      this.teacherForm.get('disciplines')?.markAsTouched();
      this.cd.markForCheck();
      return;
    }

    this.teacherSummaryService.sendTeacherForm(
        this.isEditable,
        this.teacherForm.get('disciplines')!.value!);

    this.onHideSidebar();
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
  }

  onTeacherDelete() {
    this.teacherSummaryService.deleteTeacherInformation(this.selectedTeacher!.id);
    this.onHideSidebar();
  }

  getDisciplineNames(disciplines: EducationDiscipline[]) {
    return disciplines.map(discipline => discipline.name).join(', ');
  }

  search() {
    if (this.searchValue === '') {
      this.teacherSummaryService.updateSearchedTeacher(null);
      return;
    }

    this.teacherSummaryService.searchTeacherByName(this.searchValue);
  }
}
