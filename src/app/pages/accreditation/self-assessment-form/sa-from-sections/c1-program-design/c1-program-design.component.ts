import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ProgramDesign} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {InitFormDirective} from '../init-form.directive';

@Component({
  selector: 'app-c1-program-design',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent, InitFormDirective],
  template: `
    <div formGroupName="programDesign" initForm formName="programDesign" class="flex flex-col gap-4">
      <app-sa-form-textarea
        label="Якими є цілі ОП? У чому полягають особливості (унікальність) цієї програми?"
        controlKey="goals"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, із посиланням на конкретні документи ЗВО, що цілі ОП відповідають місії та стратегії ЗВО"
        controlKey="uniqueness"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <h1 class="pl-3 text-title font-light">Опишіть, яким чином інтереси та пропозиції таких груп заінтересованих
        сторін (стейкхолдерів) були
        враховані під час формулювання цілей та програмних результатів навчання ОП:</h1>
      <app-sa-form-textarea
        label="- здобувачі вищої освіти та випускники програми"
        controlKey="stakeholderStudent"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="- роботодавці"
        controlKey="stakeholderEmployer"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="- академічна спільнота"
        controlKey="stakeholderAcademic"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="-інші стейкхолдери"
        controlKey="stakeholderOther"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, яким чином цілі та програмні результати навчання ОП відбивають тенденції розвитку спеціальності та ринку праці"
        controlKey="marketTrends"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, яким чином під час формулювання цілей та програмних результатів навчання ОП було враховано галузевий та регіональний контекст"
        controlKey="industryAndRegionalContext"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, яким чином під час формулювання цілей та програмних результатів навчання ОП було враховано досвід аналогічних вітчизняних та іноземних програм"
        controlKey="domesticAndForeignProgramsExperience"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, яким чином ОП дозволяє досягти результатів навчання, визначених стандартом вищої освіти за відповідною спеціальністю та рівнем вищої освіти"
        controlKey="learningExperienceAchieve"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Якщо стандарт вищої освіти за відповідною спеціальністю та рівнем вищої освіти відсутній, поясніть, яким чином визначені ОП програмні результати навчання відповідають вимогам Національної рамки кваліфікацій для відповідного кваліфікаційного рівня?"
        controlKey="nationalQualificationsLevel"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C1ProgramDesignComponent extends BaseControlDirective implements OnInit {

  @Input()
  initialData: ProgramDesign | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('programDesign',
      this.fb.nonNullable.group({
        goals: ['', [Validators.maxLength(1500)]],
        uniqueness: ['', [Validators.maxLength(3000)]],
        stakeholderStudent: ['', [Validators.maxLength(1500)]],
        stakeholderEmployer: ['', [Validators.maxLength(1500)]],
        stakeholderAcademic: ['', [Validators.maxLength(1500)]],
        stakeholderOther: ['', [Validators.maxLength(1500)]],
        marketTrends: ['', [Validators.maxLength(1500)]],
        industryAndRegionalContext: ['', [Validators.maxLength(1500)]],
        domesticAndForeignProgramsExperience: ['', [Validators.maxLength(1500)]],
        learningExperienceAchieve: ['', [Validators.maxLength(3000)]],
        nationalQualificationsLevel: ['', [Validators.maxLength(1500)]]
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('programDesign')?.patchValue(this.initialData);
  }
}
