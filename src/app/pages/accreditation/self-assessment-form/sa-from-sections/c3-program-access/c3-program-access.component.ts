import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {EducationalProgramAccess} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {InitFormDirective} from '../init-form.directive';

@Component({
  selector: 'app-c3-program-access',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent, InitFormDirective],
  template: `
    <div formGroupName="programAccess" initForm formName="programAccess" class="flex flex-col gap-4">
      <app-sa-form-textarea
        label="Наведіть посилання на веб-сторінку, яка містить інформацію про правила прийому на навчання та вимоги до вступників ОП"
        controlKey="admissionRulesLink"
        [maxCharacters]="1500"
        [noAdvice]="true"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Поясніть, як Правила прийому на навчання та вимоги до вступників ураховують особливості ОП?"
        controlKey="admissionRequirements"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким документом ЗВО регулюється питання визнання результатів навчання, отриманих в інших ЗВО? Яким чином забезпечується його доступність для учасників освітнього процесу?"
        controlKey="recognitionOfEducationResultsAccessibility"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть на конкретних прикладах практику застосування вказаних правил на відповідній ОП (якщо такі були)?"
        controlKey="admissionRequirementsApplyingRulesPractice"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким документом ЗВО регулюється питання визнання результатів навчання, отриманих у неформальній освіті? Яким чином забезпечується його доступність для учасників освітнього процесу?"
        controlKey="recognitionOfEducationResultsDoc"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть на конкретних прикладах практику застосування вказаних правил на відповідній ОП (якщо такі були)"
        controlKey="educationResultsDocApplyingRulesPractice"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C3ProgramAccessComponent extends BaseControlDirective implements OnInit {

  @Input()
  initialData: EducationalProgramAccess | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('programAccess',
      this.fb.nonNullable.group({
        admissionRulesLink: ['', [Validators.maxLength(1500)]],
        admissionRequirements: ['', [Validators.maxLength(1500)]],
        recognitionOfEducationResultsAccessibility: ['', [Validators.maxLength(1500)]],
        admissionRequirementsApplyingRulesPractice: ['', [Validators.maxLength(1500)]],
        recognitionOfEducationResultsDoc: ['', [Validators.maxLength(1500)]],
        educationResultsDocApplyingRulesPractice: ['', [Validators.maxLength(1500)]],
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('programAccess')?.patchValue(this.initialData);
  }
}
