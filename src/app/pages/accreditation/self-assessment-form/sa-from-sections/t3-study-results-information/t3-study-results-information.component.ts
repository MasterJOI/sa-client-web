import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EducationDiscipline, StudyResult} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {ROWS_IN_TABLE} from '../../../../../util/constants';
import {ButtonComponent} from '../../../../../components/button/button.component';
import {SharedModule} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';
import {SidebarModule} from 'primeng/sidebar';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {DynamicValidatorMessage} from '../../../../../forms/error/dynamic-validator-message.directive';
import {MultiSelectModule} from 'primeng/multiselect';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {DropdownModule} from 'primeng/dropdown';
import {StudyResultsInformationService} from './study-results-information.service';
import {
  ProgramComponentInformationService
} from '../t1-program-components-information/program-component-information.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-t3-study-results-information',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SharedModule, TableModule, CheckboxModule, SidebarModule, ReactiveFormsModule, DynamicValidatorMessage, MultiSelectModule, SaFormTextareaComponent, FormsModule, DropdownModule],
  template: `
    <p-table dataKey="id"
             [value]="(studyResults$ | async)!"
             [scrollable]="true"
             scrollHeight="500px"
             selectionMode="single"
             [(selection)]="selectedStudyResult"
             (selectionChange)="onRowSelect()"
             styleClass="list-table study-results without-actions ui-corner-all"
             responsiveLayout="scroll"
             rowGroupMode="rowspan"
             groupRowsBy="name"
             [rows]="ROWS_IN_TABLE"
             xmlns="http://www.w3.org/1999/html">
      <ng-template pTemplate="caption">
        <div class="flex items-center justify-between gap-2">
          <span class="font-kharkiv-tone text-gray-950 text-xl">Таблиця 3. Матриця відповідності</span>
          <app-button
            classes="button--primary h-12"
            (onCLick)="onStudyResultAdd()"
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
          <th>Програмний результат навчання</th>
          <th>Відповідає результату навчання</th>
          <th>Освітні компоненти</th>
          <th>Методи навчання</th>
          <th>Форми та методи оцінювання</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-studyResult let-rowgroup="rowgroup" let-rowIndex="rowIndex"
                   let-rowspan="rowspan">
        <tr [pSelectableRow]="studyResult">
          <td>{{ studyResult.name }}</td>
          <td>
            <p-checkbox [(ngModel)]="studyResult.isCorresponds" [binary]="true" [disabled]="true"></p-checkbox>
          </td>
          <td>
            <ng-container *ngFor="let correspondence of studyResult.componentCorrespondences; let i = index">
              <div class="column-row">
                {{ correspondence.discipline.name }}
              </div>
            </ng-container>
          </td>
          <td>
            <ng-container *ngFor="let correspondence of studyResult.componentCorrespondences; let i = index">
              <div class="column-row">
                {{ correspondence.teachingMethod }}
              </div>
            </ng-container>
          </td>
          <td>
            <ng-container *ngFor="let correspondence of studyResult.componentCorrespondences; let i = index">
              <div class="column-row">
                {{ correspondence.assessmentForm }}
              </div>
            </ng-container>
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
        <form id="studyResultsForm"
              [formGroup]="studyResultsForm"
              (ngSubmit)="onStudyResultsFormSubmit()"
              class="flex flex-col gap-2.5"
        >
          <app-sa-form-textarea
            label="Програмний результат навчання (ПРН)"
            controlKey="name"
            [noAdvice]="true"
            [noCounter]="true"
          ></app-sa-form-textarea>
          <div class="form-field flex-row">
            <p-checkbox formControlName="isCorresponds" [binary]="true" id="isCorresponds"></p-checkbox>
            <label for="isCorresponds">
              ПРН відповідає результату навчання, визначеному стандартом вищої освіти (або охоплює його)
            </label>
          </div>
          <fieldset formArrayName="componentCorrespondences">
            <legend>Обов’язкові освітні компоненти</legend>
            <div class="flex flex-col gap-2.5"
                 *ngFor="let componentCorrespondence of studyResultsForm.controls.componentCorrespondences.controls; index as i"
                 [formGroupName]="i"
            >
              <div class="form-field">
                <label for="discipline-{{i}}">Освітній компонент</label>
                <p-dropdown id="discipline-{{i}}"
                            styleClass="w-full"
                            [options]="disciplines"
                            formControlName="disciplineId"
                            optionLabel="name"
                            optionValue="id"
                            [filter]="true"
                            filterBy="name"
                ></p-dropdown>
              </div>
              <app-sa-form-textarea
                label="Методи навчання"
                controlKey="teachingMethod"
                [noAdvice]="true"
                [noCounter]="true"
              ></app-sa-form-textarea>
              <app-sa-form-textarea
                label="Форми та методи оцінювання"
                controlKey="assessmentForm"
                [noAdvice]="true"
                [noCounter]="true"
              ></app-sa-form-textarea>
              <app-button
                classes="button--outlined h-12 w-full {{componentCorrespondences.length < 2 ? 'button--disabled' : ''}}"
                (onCLick)="removeCorrespondence(i)"
              >
                <div class="flex justify-center items-center gap-2">
                  <img
                    src="assets/icons/ic_remove.svg"
                    alt="Remove correspondence">
                  <p class="text-gray-950 text-title">Видалити компонент</p>
                </div>
              </app-button>
              <hr class="border-secondary-600 rounded space-y-2">
            </div>
            <app-button
              classes="button--primary h-12 w-full"
              (onCLick)="addCorrespondence()"
            >
              <div class="flex justify-center items-center gap-2">
                <img
                  src="assets/icons/ic_plus.svg"
                  alt="Add correspondence">
                <p class="text-gray-950 text-title">Додати компонент</p>
              </div>
            </app-button>
          </fieldset>
          <div class="flex gap-2 justify-between">
            <div class="flex gap-2">
              <app-button
                type="submit"
                form="studyResultsForm"
                classes="button--primary h-12"
              >
                Зберегти
              </app-button>
              <ng-container *ngIf="isEditable">
                <app-button
                  classes="button--danger h-12"
                  (onCLick)="onStudyResultDelete()">
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
      </p-sidebar>
  `,
  styles: [
    `
      .column-row {
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 1px solid #dee2e6;
        padding: 16px;
      }

      td:nth-last-child(-n+3) .column-row:last-child {
        border-bottom: none;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class T3StudyResultsInformationComponent implements OnInit {

  protected readonly ROWS_IN_TABLE = ROWS_IN_TABLE;

  private fb = inject(FormBuilder);
  private studyResultsService = inject(StudyResultsInformationService);
  private componentInformationService = inject(ProgramComponentInformationService);
  private destroyRef = inject(DestroyRef);
  private cd = inject(ChangeDetectorRef);

  formVisible = false;
  isEditable: boolean = false;

  studyResults$ = this.studyResultsService.studyResults$;
  disciplines: EducationDiscipline[] = [];
  selectedStudyResult: StudyResult | null = null;

  studyResultsForm = this.fb.nonNullable.group({
    name: [''],
    isCorresponds: [false],
    componentCorrespondences: this.fb.nonNullable.array([])
  });

  ngOnInit() {
    this.studyResultsService.selectedStudyResult$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(s => this.selectedStudyResult = s);

    this.componentInformationService.getDisciplinesList().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(d => this.disciplines = d);
  }

  get componentCorrespondences() {
    return this.studyResultsForm.get('componentCorrespondences') as FormArray;
  }

  onRowSelect() {
    this.isEditable = true;
    this.formVisible = true;

    this.studyResultsForm.patchValue({
      name: this.selectedStudyResult?.name,
      isCorresponds: this.selectedStudyResult?.isCorresponds,
    });

    if (this.selectedStudyResult && this.selectedStudyResult.componentCorrespondences) {
      this.componentCorrespondences.clear();

      this.selectedStudyResult.componentCorrespondences.forEach((correspondence) => {
        this.componentCorrespondences.push(
          this.fb.group({
            id: [correspondence.id],
            disciplineId: [correspondence.discipline.id, Validators.required],
            teachingMethod: [correspondence.teachingMethod],
            assessmentForm: [correspondence.assessmentForm]
          })
        );
      });
    }
    this.studyResultsService.selectedStudyResult(this.selectedStudyResult);
  }

  addCorrespondence() {
    // @ts-ignore
    this.studyResultsForm.controls.componentCorrespondences.push(new FormGroup({
        id: new FormControl(null),
        disciplineId: new FormControl(this.disciplines[0].id, [Validators.required]),
        teachingMethod: new FormControl(''),
        assessmentForm: new FormControl('')
      })
    );
  }

  removeCorrespondence(index: number) {
    this.studyResultsForm.controls.componentCorrespondences.removeAt(index);
  }

  onHideSidebar() {
    this.formVisible = false;
    this.isEditable = false;
    this.studyResultsService.selectedStudyResult(null);
    this.studyResultsForm.reset();
    this.componentCorrespondences.clear();

  }

  onStudyResultAdd() {
    this.isEditable = false;
    this.formVisible = true;
    this.addCorrespondence();
  }

  onStudyResultsFormSubmit() {
    if (this.studyResultsForm.invalid) {
      this.studyResultsForm.markAllAsTouched();
      this.cd.markForCheck();
      return;
    }

    this.studyResultsService.sendStudyResultForm(
      this.isEditable,
      this.studyResultsForm.value
    );
    this.onHideSidebar();
  }

  onStudyResultDelete() {
    this.studyResultsService.deleteStudyResult(this.selectedStudyResult!.id);
    this.onHideSidebar();
  }
}
