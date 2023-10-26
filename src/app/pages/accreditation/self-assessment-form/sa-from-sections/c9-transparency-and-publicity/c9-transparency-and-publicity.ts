import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {EducationalTransparencyAndPublicity} from '../../../../../dto/self_assessment/SelfAssessmentInfo';
import {InitFormDirective} from '../init-form.directive';

@Component({
  selector: 'app-c9-transparency-and-publicity',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent, InitFormDirective],
  template: `
    <div formGroupName="transparencyAndPublicity" initForm formName="transparencyAndPublicity" class="flex flex-col gap-4">
      <app-sa-form-textarea
        label="Якими документами ЗВО регулюється права та обов’язки усіх учасників освітнього процесу? Яким чином забезпечується їх доступність для учасників освітнього процесу?"
        controlKey="regulatoryDocuments"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Наведіть посилання на веб-сторінку, яка містить інформацію про оприлюднення на офіційному веб-сайті ЗВО відповідного проекту з метою отримання зауважень та пропозиції заінтересованих сторін (стейкхолдерів)."
        controlKey="stakeholderFeedbackLink"
        [maxCharacters]="1500"
        [noAdvice]="true"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Наведіть посилання на оприлюднену у відкритому доступі в мережі Інтернет інформацію про освітню програму (включаючи її цілі, очікувані результати навчання та компоненти)"
        controlKey="educationalProgramLink"
        [maxCharacters]="1500"
        [noAdvice]="true"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C9TransparencyAndPublicity extends BaseControlDirective implements OnInit {

  @Input()
  initialData: EducationalTransparencyAndPublicity | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('transparencyAndPublicity',
      this.fb.nonNullable.group({
        regulatoryDocuments: ['', [Validators.maxLength(1500)]],
        stakeholderFeedbackLink: ['', [Validators.maxLength(1500)]],
        educationalProgramLink: ['', [Validators.maxLength(1500)]],
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('transparencyAndPublicity')?.patchValue(this.initialData);
  }
}
