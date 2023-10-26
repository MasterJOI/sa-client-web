import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {EducationalProgramLearningAndTeaching} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {InitFormDirective} from '../init-form.directive';

@Component({
  selector: 'app-c4-learning-and-teaching',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent, InitFormDirective],
  template: `
    <div formGroupName="learningAndTeaching" initForm formName="learningAndTeaching" class="flex flex-col gap-4">
      <app-sa-form-textarea
        label="Продемонструйте, яким чином форми та методи навчання і викладання на ОП сприяють досягненню програмних результатів навчання? Наведіть посилання на відповідні документи"
        controlKey="learningAndTeachingMethods"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, яким чином форми і методи навчання і викладання відповідають вимогам студентоцентрованого підходу? Яким є рівень задоволеності здобувачів вищої освіти методами навчання і викладання відповідно до результатів опитувань?"
        controlKey="studentCenteredApproach"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, яким чином забезпечується відповідність методів навчання і викладання на ОП принципам академічної свободи"
        controlKey="academicFreedom"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, яким чином і у які строки учасникам освітнього процесу надається інформація щодо цілей, змісту та очікуваних результатів навчання, порядку та критеріїв оцінювання у межах окремих освітніх компонентів"
        controlKey="learningOutcomes"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, яким чином відбувається поєднання навчання і досліджень під час реалізації ОП"
        controlKey="learningAndResearch"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, із посиланням на конкретні приклади, яким чином викладачі оновлюють зміст освітніх компонентів на основі наукових досягнень і сучасних практик у відповідній галузі"
        controlKey="curriculumUpdate"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, яким чином навчання, викладання та наукові дослідження у межах ОП пов’язані із інтернаціоналізацією діяльності ЗВО"
        controlKey="internationalization"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C4LearningAndTeachingComponent extends BaseControlDirective implements OnInit {

  @Input()
  initialData: EducationalProgramLearningAndTeaching | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('learningAndTeaching',
      this.fb.nonNullable.group({
        learningAndTeachingMethods: ['', [Validators.maxLength(1500)]],
        studentCenteredApproach: ['', [Validators.maxLength(1500)]],
        academicFreedom: ['', [Validators.maxLength(1500)]],
        learningOutcomes: ['', [Validators.maxLength(1500)]],
        learningAndResearch: ['', [Validators.maxLength(1500)]],
        curriculumUpdate: ['', [Validators.maxLength(1500)]],
        internationalization: ['', [Validators.maxLength(1500)]],
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('learningAndTeaching')?.patchValue(this.initialData);
  }
}
