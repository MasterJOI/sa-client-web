import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {HumanResource} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {InitFormDirective} from '../init-form.directive';

@Component({
  selector: 'app-c6-human-resource',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent, InitFormDirective],
  template: `
    <div formGroupName="humanResource" initForm formName="humanResource" class="flex flex-col gap-4">
      <app-sa-form-textarea
        label="Яким чином під час конкурсного добору викладачів ОП забезпечується необхідний рівень їх професіоналізму?"
        controlKey="competencyLevel"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, із посиланням на конкретні приклади, яким чином ЗВО залучає роботодавців до організації та реалізації освітнього процесу"
        controlKey="employersEngagement"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, із посиланням на конкретні приклади, яким чином ЗВО залучає до аудиторних занять на ОП професіоналів-практиків, експертів галузі, представників роботодавців"
        controlKey="expertInvolvement"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, яким чином ЗВО сприяє професійному розвиткові викладачів ОП? Наведіть конкретні приклади такого сприяння"
        controlKey="teacherDevelopment"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, що ЗВО стимулює розвиток викладацької майстерності"
        controlKey="teachingExcellence"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C6HumanResource extends BaseControlDirective implements OnInit {

  @Input()
  initialData: HumanResource | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('humanResource',
      this.fb.nonNullable.group({
        competencyLevel: ['', [Validators.maxLength(1500)]],
        employersEngagement: ['', [Validators.maxLength(1500)]],
        expertInvolvement: ['', [Validators.maxLength(1500)]],
        teacherDevelopment: ['', [Validators.maxLength(1500)]],
        teachingExcellence: ['', [Validators.maxLength(1500)]]
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('humanResource')?.patchValue(this.initialData);
  }
}
