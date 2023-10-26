import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {OpDevelopmentPerspective} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {InitFormDirective} from '../init-form.directive';

@Component({
  selector: 'app-c11-development-perspective',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent, InitFormDirective],
  template: `
    <div formGroupName="developmentPerspective" initForm formName="developmentPerspective" class="flex flex-col gap-4">
      <app-sa-form-textarea
        label="Якими загалом є сильні та слабкі сторони ОП?"
        controlKey="strongWeakPoints"
        [maxCharacters]="3000"
        [noAdvice]="true"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Якими є перспективи розвитку ОП упродовж найближчих 3 років? Які конкретні заходи ЗВО планує здійснити задля реалізації цих перспектив?"
        controlKey="futureDevelopment"
        [maxCharacters]="1500"
        [noAdvice]="true"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C11DevelopmentPerspective extends BaseControlDirective implements OnInit {

  @Input()
  initialData: OpDevelopmentPerspective | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('developmentPerspective',
      this.fb.nonNullable.group({
        strongWeakPoints: ['', [Validators.maxLength(3000)]],
        futureDevelopment: ['', [Validators.maxLength(1500)]],
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('developmentPerspective')?.patchValue(this.initialData);
  }
}
