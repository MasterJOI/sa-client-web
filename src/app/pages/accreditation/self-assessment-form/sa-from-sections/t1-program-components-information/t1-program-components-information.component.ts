import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {componentTypes, ROWS_IN_TABLE} from '../../../../../util/constants';
import {ButtonComponent} from '../../../../../components/button/button.component';
import {SharedModule} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {SidebarModule} from 'primeng/sidebar';
import {FormBuilder, ReactiveFormsModule, UntypedFormControl, Validators} from '@angular/forms';
import {PaginatorModule} from 'primeng/paginator';
import {DynamicValidatorMessage} from '../../../../../forms/error/dynamic-validator-message.directive';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {fileValidator} from 'src/app/forms/validators/file.validator';
import {ProgramEducationalComponent} from 'src/app/dto/self_assessment/SelfAssessmentInfo';
import {ProgramComponentInformationService} from './program-component-information.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AutoTitleDirective} from '../../../../../directives/auto-title.directive';

@Component({
    selector: 'app-t1-program-components-information',
    standalone: true,
    imports: [CommonModule, ButtonComponent, SharedModule, TableModule, TagModule, SidebarModule, PaginatorModule, ReactiveFormsModule, DynamicValidatorMessage, SaFormTextareaComponent, AutoTitleDirective],
    template: `
        <p-table dataKey="id"
                 [value]="(programComponents$ | async)!"
                 [scrollable]="true"
                 scrollHeight="500px"
                 selectionMode="single"
                 [(selection)]="selectedProgramComponent"
                 (selectionChange)="onRowSelect()"
                 styleClass="list-table without-actions ui-corner-all"
                 responsiveLayout="scroll"
                 groupRowsBy="id"
                 [rows]="ROWS_IN_TABLE"
                 xmlns="http://www.w3.org/1999/html">
            <ng-template pTemplate="caption">
                <div class="flex items-center justify-between gap-2">
                    <span class="font-kharkiv-tone text-gray-950 text-xl">
                      Таблиця 1. Інформація про обов’язкові освітні компоненти ОП
                    </span>
                    <app-button
                            classes="button--primary h-12"
                            (onCLick)="onComponentAdd()"
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
                    <th>Назва освітнього компонента</th>
                    <th>Вид компонента</th>
                    <th>Назва файлу</th>
                    <th>Відомості щодо МТЗ</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-component let-rowIndex="rowIndex">
                <tr [pSelectableRow]="component">
                    <td>
                        {{component.componentName}}
                    </td>
                    <td>
                        {{getDocumentType(component.componentType)}}
                    </td>
                    <td>
                        {{component.documentName}}
                    </td>
                    <td>
                        {{component.specialEquipmentInfo}}
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <ng-container *ngIf="selectedProgramComponent || !isEditable">
            <p-sidebar
                    #sidebar
                    styleClass="w-[500px]"
                    [(visible)]="formVisible"
                    [dismissible]="false"
                    (onHide)="onHideSidebar()"
                    position="right">
                <form id="componentForm"
                      [formGroup]="componentForm"
                      (ngSubmit)="onComponentFormSubmit()"
                      class="flex flex-col gap-2.5"
                >
                    <app-sa-form-textarea
                            label="Назва освітнього компонента"
                            controlKey="componentName"
                            [maxCharacters]="200"
                            [noAdvice]="true"
                    ></app-sa-form-textarea>
                    <div class="form-field">
                        <label for="componentType">Вид компонента</label>
                      <p-dropdown id="componentType"
                                  styleClass="w-full"
                                  [options]="componentTypes"
                                  formControlName="componentType"
                                  optionLabel="label"
                                  optionValue="value"
                      ></p-dropdown>
                    </div>
                    <ng-container *ngIf="selectedProgramComponent?.documentPath">
                        <div class="form-field">
                            <label for="documentName">Поточний файл</label>
                            <div class="flex gap-2">
                                <input
                                        formControlName="documentName"
                                        type="text"
                                        readonly
                                >
                                <app-button
                                        classes="button--dark h-full"
                                        (onCLick)="downloadFile()"
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
                    <div class="form-field">
                        <label for="fileInput">Поле для завантаження файлу</label>
                        <div>
                            <input
                                    name="fileInput"
                                    #fileInput
                                    type="file"
                                    (click)="fileInput.value = ''"
                                    (change)="onFileChange($event)"
                                    accept=".doc,.docx,.pdf"
                                    required
                            >
                        </div>
                    </div>
                    <app-sa-form-textarea
                            label="Відомості щодо МТЗ"
                            controlKey="specialEquipmentInfo"
                            [maxCharacters]="1500"
                            [noAdvice]="true"
                    ></app-sa-form-textarea>
                    <div class="flex gap-2 justify-between">
                        <div class="flex gap-2">
                            <app-button
                                    type="submit"
                                    form="componentForm"
                                    classes="button--primary h-12"
                            >
                                Зберегти
                            </app-button>
                            <ng-container *ngIf="isEditable">
                                <app-button
                                        classes="button--danger h-12"
                                        (onCLick)="onComponentDelete()">
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
        </ng-container>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class T1ProgramComponentsInformationComponent implements OnInit {

    private fb = inject(FormBuilder);
    private destroyRef = inject(DestroyRef);
    private componentInformationService = inject(ProgramComponentInformationService);
    private cd = inject(ChangeDetectorRef);

    programComponents$ = this.componentInformationService.programComponents$;
    selectedProgramComponent: ProgramEducationalComponent | null = null;
    protected readonly ROWS_IN_TABLE = ROWS_IN_TABLE;

    formVisible = false;
    isEditable: boolean = false;

    componentForm = this.fb.nonNullable.group({
        componentName: ['', [Validators.maxLength(200)]],
        componentType: [componentTypes[0].value],
        documentName: [''],
        document: new UntypedFormControl('',
            [Validators.nullValidator, fileValidator]),
        specialEquipmentInfo: ['', [Validators.maxLength(1500)]]
    });

    ngOnInit() {
        this.componentInformationService.selectedProgramComponent$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(c =>
            this.selectedProgramComponent = c);
    }

    onRowSelect() {
        this.isEditable = true;
        this.formVisible = true;
        this.componentForm.patchValue({
            componentName: this.selectedProgramComponent?.componentName,
            componentType: this.selectedProgramComponent?.componentType,
            documentName: this.selectedProgramComponent?.documentName,
            specialEquipmentInfo: this.selectedProgramComponent?.specialEquipmentInfo
        });
        this.componentInformationService.selectedProgramComponent(this.selectedProgramComponent);
    }

    onFileChange(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        let files = element.files;
        if (files && files.length > 0) {
            this.componentForm.patchValue({
                documentName: files.item(0)!.name,
                document: files.item(0)
            });
        }
    }

    onComponentFormSubmit() {
        if (this.componentForm.invalid) {
            this.componentForm.markAsTouched();
            this.cd.markForCheck();
            return;
        }
        this.componentInformationService.sendComponentForm(
            this.isEditable,
            this.selectedProgramComponent?.id,
            this.componentForm.value);
        this.onHideSidebar();
    }

    onComponentAdd() {
        this.isEditable = false;
        this.formVisible = true;
    }

    onHideSidebar() {
        this.formVisible = false;
        this.isEditable = false;
        this.componentInformationService.selectedProgramComponent(null);
        this.componentForm.reset();
    }

    onComponentDelete() {
        this.componentInformationService.deleteComponentInformation(this.selectedProgramComponent!.id);
        this.onHideSidebar();
    }

    downloadFile() {
        this.componentInformationService.downloadFile(
            this.selectedProgramComponent!.id,
            this.selectedProgramComponent!.documentName
        );
    }

  protected readonly componentTypes = componentTypes;

  getDocumentType(componentType: string) {
    return componentTypes.find(t => t.value === componentType)?.label;
  }
}
