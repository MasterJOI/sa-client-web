import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ButtonComponent} from '../../../components/button/button.component';
import {EducationProgram} from '../../../dto/education_programs/EducationProgram';
import {EducationProgramsStore} from '../../../services/education-programs.store';
import {PageLoaderComponent} from '../../../components/page-loader/page-loader.component';
import {ROWS_IN_TABLE} from '../../../util/constants';
import {RouterLink} from '@angular/router';
import {SaModalComponent} from '../../../components/modals/sa-modal.component';
import {DialogActionComponent} from '../../../components/modals/actions/dialog-action.component';
import {DynamicValidatorMessage} from '../../../forms/error/dynamic-validator-message.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StudentFormComponent} from '../../auth/registration/student-form/student-form.component';
import {TeacherFormComponent} from '../../auth/registration/teacher-form/teacher-form.component';
import {ValidatorMessageContainer} from '../../../forms/error/input-error/validator-message-container.directive';
import {DropdownModule} from 'primeng/dropdown';
import {CreateProgramFormComponent} from '../../../components/modals/actions/create-program-form.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MenuItem} from 'primeng/api';
import {SplitButtonModule} from 'primeng/splitbutton';
import {Menu, MenuModule} from 'primeng/menu';
import {AutoTitleDirective} from '../../../directives/auto-title.directive';

@Component({
  selector: 'app-education-programs-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonComponent, PageLoaderComponent, RouterLink, SaModalComponent, DialogActionComponent, DynamicValidatorMessage, FormsModule, ReactiveFormsModule, StudentFormComponent, TeacherFormComponent, ValidatorMessageContainer, DropdownModule, CreateProgramFormComponent, SplitButtonModule, MenuModule, AutoTitleDirective],
  template: `
    <p-table dataKey="id"
             [value]="(educationPrograms$ | async)!"
             [scrollable]="true"
             scrollHeight="500px"
             [(selection)]="selectedPrograms"
             styleClass="list-table with-actions autoTitle"
             responsiveLayout="scroll"
             groupRowsBy="id"
             [paginator]="true"
             [rows]="ROWS_IN_TABLE"
             [lazy]="true"
             (onLazyLoad)="onPageChange($event)"
             [totalRecords]="(totalPrograms$ | async)!"
    >
      <ng-template pTemplate="caption">
        <div class="flex items-center justify-between">
          <span class="font-kharkiv-tone text-gray-950 text-xl">Акредитаційні справи</span>
          <app-button
            classes="button--primary h-12"
            (onCLick)="onCreateModalOpen()"
          >
            <div class="flex justify-center items-center gap-2">
              <img
                src="assets/icons/ic_plus.svg"
                alt="Add program">
              <p class="text-gray-950 text-title">Створити</p>
            </div>
          </app-button>
        </div>
      </ng-template>
      <ng-template pTemplate="header">
        <tr class="autoTitle">
          <th *ngIf="(educationPrograms$ | async)!.length > 0" class="w-[70px]">
            <div class="flex items-center gap-3">
              <p-tableHeaderCheckbox class="flex justify-center items-center"></p-tableHeaderCheckbox>
              <button
                class="min-w-[14px] h-[18px]"
                (click)="onDeleteModalOpen()"
              >
                <img
                  src="assets/icons/ic_trash.svg"
                  alt="Delete several">
              </button>
            </div>
          </th>
          <th class="w-[100px]">ID ОП</th>
          <th>Рівень вищої освіти</th>
          <th>Спеціальність</th>
          <th>Назва ОП</th>
          <th>Тип ОП
          </th>
          <th class="w-[100px]">Статус</th>
          <th class="w-[60px]"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-program let-rowIndex="rowIndex">
        <tr>
          <td class="w-[70px]">
            <p-tableCheckbox [value]="program"></p-tableCheckbox>
          </td>
          <td class="w-[100px]">
            {{program.educationProgramId}}
          </td>
          <td>
            {{program.cycle}}
          </td>
          <td>
            {{program.specialtyCode}} {{program.specialty}}
          </td>
          <td>
            {{program.name}}
          </td>
          <td>
            {{program.programType}}
          </td>
          <td class="w-[100px]">
            <p-tag [value]="program.status" [severity]="getSeverity(program.status)" [rounded]="true"></p-tag>
          </td>
          <td class="w-[60px]">
            <p-menu #programMenu [model]="programActions" [popup]="true" appendTo="body"></p-menu>
            <button class="w-[14px] relative" type="button"
                    (click)="setProgramActions($event, program.id)">
              <img
                src="assets/icons/ic_dots.svg"
                alt="Edit">
            </button>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <!--modals-->

    <app-sa-modal
      [(visible)]="isDeleteModalVisible"
      (submitted)="onDeleteSubmitted($event)"
      [headerTemplate]="deleteHeaderTemplate"
      [contentTemplate]="deleteContentTemplate"
      [footerTemplate]="deleteActionsTemplate"
    ></app-sa-modal>

    <ng-template #deleteHeaderTemplate>
      <h2 class="font-kharkiv-tone text-gray-950 text-xl">Видалення освітніх програм</h2>
    </ng-template>

    <ng-template #deleteContentTemplate>
      <div class="p-3 text-center">
        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
        <h3 class="text-lg font-normal text-gray-500 dark:text-gray-400">Ви дійсно хочете видалити обрані освітні
          програми: {{selectedPrograms.length}}?</h3>
      </div>
    </ng-template>

    <ng-template #deleteActionsTemplate>
      <app-dialog-action></app-dialog-action>
    </ng-template>

    <app-sa-modal
      [(visible)]="isCreateModalVisible"
      [headerTemplate]="createHeaderTemplate"
      [contentTemplate]="createContentTemplate"
    ></app-sa-modal>

    <ng-template #createHeaderTemplate>
      <h2 class="font-kharkiv-tone text-gray-950 text-xl">Створення акредитаційної справи</h2>
    </ng-template>

    <ng-template #createContentTemplate>
      <app-create-program-form></app-create-program-form>
    </ng-template>
  `,
  styles: [
    `:host {
      width: 100%;
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationProgramsTableComponent implements OnInit, OnDestroy {

  protected readonly ROWS_IN_TABLE = ROWS_IN_TABLE;

  private educationProgramsStore = inject(EducationProgramsStore);
  private destroyRef = inject(DestroyRef);

  educationPrograms$ = this.educationProgramsStore.educationPrograms$;
  totalPrograms$ = this.educationProgramsStore.totalPrograms.asObservable();

  selectedPrograms: EducationProgram[] = [];
  currentPage = 0;

  isDeleteModalVisible = false;
  isCreateModalVisible = false;

  @ViewChild('programMenu') programMenu!: Menu;
  programActions: MenuItem[] = [];

  ngOnInit() {
    this.educationProgramsStore.loadEducationPrograms(0, ROWS_IN_TABLE);

    this.educationProgramsStore.isCreateModalVisible$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res =>
      this.isCreateModalVisible = res);
  }

  onPageChange(e: TableLazyLoadEvent) {
    if (this.currentPage !== e.first) {
      const from = e.first!;
      this.currentPage = e.first!;
      this.educationProgramsStore.loadEducationPrograms(from, ROWS_IN_TABLE);
    }
  }

  getSeverity(status: string) {
    switch (status) {
      case 'В роботі':
        return 'primary'
      case 'Акредитована':
        return 'success'
      case 'Закрита':
        return 'danger'
      default:
        return 'primary'
    }
  }

  onDeleteModalOpen() {
    if (this.selectedPrograms.length > 0) this.isDeleteModalVisible = true;
  }

  onCreateModalOpen() {
    this.educationProgramsStore.changeCreateModalVisibility(true);
  }

  onDeleteSubmitted(isSubmitted: boolean) {
    this.isDeleteModalVisible = false;
    if (isSubmitted) {
      this.educationProgramsStore.deletePrograms(this.selectedPrograms);
      this.selectedPrograms = [];
    }
  }

  onGenerate(id: string) {
    this.educationProgramsStore.generateSelfAssessmentDocument(id);
  }

  setProgramActions($event: MouseEvent, id: string) {
    this.programMenu.toggle($event);
    this.programActions = [
      {
        label: 'Відомості про СО',
        icon: 'pi pi-book',
        routerLink: ['/accreditation', id]
      },
      {
        label: 'Експорт',
        icon: 'pi pi-file-export',
        command: () => {
          this.onGenerate(id);
        }
      }
    ];
  }

  ngOnDestroy() {
    this.educationProgramsStore.changeCreateModalVisibility(false);
  }
}
