import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {ControlMeasuresAndAcademicIntegrity} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {InitFormDirective} from '../init-form.directive';

@Component({
  selector: 'app-c5-control-measures-and-academic-integrity',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent, InitFormDirective],
  template: `
    <div formGroupName="controlMeasuresAndAcademicIntegrity" initForm formName="controlMeasuresAndAcademicIntegrity" class="flex flex-col gap-4">
      <app-sa-form-textarea
        label="Опишіть, яким чином форми контрольних заходів у межах навчальних дисциплін ОП дозволяють перевірити досягнення програмних результатів навчання?"
        controlKey="description"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином забезпечуються чіткість та зрозумілість форм контрольних заходів та критеріїв оцінювання навчальних досягнень здобувачів вищої освіти?"
        controlKey="clarityCriteria"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином і у які строки інформація про форми контрольних заходів та критерії оцінювання доводиться до здобувачів вищої освіти?"
        controlKey="informationProvision"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином форми атестації здобувачів вищої освіти відповідають вимогам стандарту вищої освіти (за наявності)?"
        controlKey="complianceRequirements"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким документом ЗВО регулюється процедура проведення контрольних заходів? Яким чином забезпечується його доступність для учасників освітнього процесу?"
        controlKey="accessibilityCertificationProcedure"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином ці процедури забезпечують об’єктивність екзаменаторів? Якими є процедури запобігання та врегулювання конфлікту інтересів? Наведіть приклади застосування відповідних процедур на ОП"
        controlKey="objectivityProcedures"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином процедури ЗВО урегульовують порядок повторного проходження контрольних заходів? Наведіть приклади застосування відповідних правил на ОП"
        controlKey="repeatingControlMeasuresProcedures"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином процедури ЗВО урегульовують порядок оскарження процедури проведення та результатів контрольних заходів? Наведіть приклади застосування відповідних правил на ОП"
        controlKey="appealProcedureAndResultsOfControlMeasures"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Які документи ЗВО містять політику, стандарти і процедури дотримання академічної доброчесності?"
        controlKey="policiesAndStandardsDocuments"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Які технологічні рішення використовуються на ОП як інструменти протидії порушенням академічної доброчесності?"
        controlKey="combatingViolationsOfAcademicIntegritySolutions"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином ЗВО популяризує академічну доброчесність серед здобувачів вищої освіти ОП?"
        controlKey="promotingAcademicIntegrity"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином ЗВО реагує на порушення академічної доброчесності? Наведіть приклади відповідних ситуацій щодо здобувачів вищої освіти відповідної ОП"
        controlKey="respondingToViolationsOfAcademicIntegrity"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C5ControlMeasuresAndAcademicIntegrity extends BaseControlDirective implements OnInit {

  @Input()
  initialData: ControlMeasuresAndAcademicIntegrity | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('controlMeasuresAndAcademicIntegrity',
      this.fb.nonNullable.group({
        description: ['', [Validators.maxLength(3000)]],
        clarityCriteria: ['', [Validators.maxLength(1500)]],
        informationProvision: ['', [Validators.maxLength(1500)]],
        complianceRequirements: ['', [Validators.maxLength(1500)]],
        accessibilityCertificationProcedure: ['', [Validators.maxLength(1500)]],
        objectivityProcedures: ['', [Validators.maxLength(1500)]],
        repeatingControlMeasuresProcedures: ['', [Validators.maxLength(1500)]],
        appealProcedureAndResultsOfControlMeasures: ['', [Validators.maxLength(1500)]],
        policiesAndStandardsDocuments: ['', [Validators.maxLength(1500)]],
        combatingViolationsOfAcademicIntegritySolutions: ['', [Validators.maxLength(1500)]],
        promotingAcademicIntegrity: ['', [Validators.maxLength(1500)]],
        respondingToViolationsOfAcademicIntegrity: ['', [Validators.maxLength(1500)]],
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('controlMeasuresAndAcademicIntegrity')?.patchValue(this.initialData);
  }
}
