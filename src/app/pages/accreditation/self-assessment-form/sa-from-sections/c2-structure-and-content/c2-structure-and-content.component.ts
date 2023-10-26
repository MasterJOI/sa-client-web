import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {DynamicValidatorMessage} from '../../../../../forms/error/dynamic-validator-message.directive';
import {
  EducationalProgramStructureAndContent,
  ProgramDesign
} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {InitFormDirective} from '../init-form.directive';

@Component({
  selector: 'app-c2-structure-and-content',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent, DynamicValidatorMessage, InitFormDirective],
  template: `
    <div formGroupName="structureAndContent" initForm formName="structureAndContent" class="flex flex-col gap-4">
      <div class="form-field">
        <label for="epCreditsAmount">Яким є обсяг ОП (у кредитах ЄКТС)?</label>
        <input formControlName="epCreditsAmount" type="number" id="epCreditsAmount"
               placeholder="Введіть кількість кредитів">
      </div>
      <div class="form-field">
        <label for="componentsCreditsAmount">Яким є обсяг освітніх компонентів (у кредитах ЄКТС), спрямованих на
          формування компетентностей, визначених стандартом вищої освіти за відповідною спеціальністю та рівнем вищої
          освіти (за наявності)?</label>
        <input formControlName="componentsCreditsAmount" type="number" id="componentsCreditsAmount"
               placeholder="Введіть кількість кредитів">
      </div>
      <div class="form-field">
        <label for="studentElectivesCreditsAmount">Який обсяг (у кредитах ЄКТС) відводиться на дисципліни за вибором
          здобувачів вищої освіти?</label>
        <input formControlName="studentElectivesCreditsAmount" type="number" id="studentElectivesCreditsAmount"
               placeholder="Введіть кількість кредитів">
      </div>
      <app-sa-form-textarea
        label="Продемонструйте, що зміст ОП відповідає предметній області заявленої для неї спеціальності (спеціальностям, якщо освітня програма є міждисциплінарною)"
        controlKey="contentCompliance"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином здобувачам вищої освіти забезпечена можливість формування індивідуальної освітньої траєкторії?"
        controlKey="individualLearningPath"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином здобувачі вищої освіти можуть реалізувати своє право на вибір навчальних дисциплін?"
        controlKey="studentChoiceRight"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, яким чином ОП та навчальний план передбачають практичну підготовку здобувачів вищої освіти, яка дозволяє здобути компетентності, необхідні для подальшої професійної діяльності"
        controlKey="studentPracticalTraining"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, що ОП дозволяє забезпечити набуття здобувачами вищої освіти соціальних навичок (soft skills) упродовж періоду навчання, які відповідають цілям та результатам навчання ОП"
        controlKey="studentSoftSkills"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином зміст ОП ураховує вимоги відповідного професійного стандарту?"
        controlKey="relevantProfessionalStandard"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Який підхід використовує ЗВО для співвіднесення обсягу окремих освітніх компонентів ОП (у кредитах ЄКТС) із фактичним навантаженням здобувачів вищої освіти (включно із самостійною роботою)?"
        controlKey="componentsScopeCorrelatingApproach"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Якщо за ОП здійснюється підготовка здобувачів вищої освіти за дуальною формою освіти, продемонструйте, яким чином структура освітньої програми та навчальний план зумовлюються завданнями та особливостями цієї форми здобуття освіти"
        controlKey="dualFormEducationStructure"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C2StructureAndContentComponent extends BaseControlDirective implements OnInit {

  @Input()
  initialData: EducationalProgramStructureAndContent | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('structureAndContent',
      this.fb.nonNullable.group({
        epCreditsAmount: ['', [Validators.max(200)]],
        componentsCreditsAmount: ['', Validators.max(200)],
        studentElectivesCreditsAmount: ['', Validators.max(200)],
        contentCompliance: ['', [Validators.maxLength(3000)]],
        individualLearningPath: ['', [Validators.maxLength(1500)]],
        studentChoiceRight: ['', [Validators.maxLength(3000)]],
        studentPracticalTraining: ['', [Validators.maxLength(1500)]],
        studentSoftSkills: ['', [Validators.maxLength(1500)]],
        relevantProfessionalStandard: ['', [Validators.maxLength(1500)]],
        componentsScopeCorrelatingApproach: ['', [Validators.maxLength(1500)]],
        dualFormEducationStructure: ['', [Validators.maxLength(1500)]]
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('structureAndContent')?.patchValue(this.initialData);
  }
}
