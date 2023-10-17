import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {EducationalEnvironmentAndMaterialResource} from '../../../../../dto/self_assessment/SelfAssessmentInfo';

@Component({
  selector: 'app-c7-educational-environment-and-material-resource',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent],
  template: `
    <div formGroupName="educationalEnvironmentAndMaterialResource" class="flex flex-col gap-4">
      <app-sa-form-textarea
        label="Продемонструйте, яким чином фінансові та матеріально-технічні ресурси (бібліотека, інша інфраструктура, обладнання тощо), а також навчально-методичне забезпечення ОП забезпечують досягнення визначених ОП цілей та програмних результатів навчання?"
        controlKey="financialResources"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, яким чином освітнє середовище, створене у ЗВО, дозволяє задовольнити потреби та інтереси здобувачів вищої освіти ОП? Які заходи вживаються ЗВО задля виявлення і врахування цих потреб та інтересів?"
        controlKey="educationalEnvironment"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, яким чином ЗВО забезпечує безпечність освітнього середовища для життя та здоров’я здобувачів вищої освіти (включаючи психічне здоров’я)"
        controlKey="safetyMeasures"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть механізми освітньої, організаційної, інформаційної, консультативної та соціальної підтримки здобувачів вищої освіти? Яким є рівень задоволеності здобувачів вищої освіти цією підтримкою відповідно до результатів опитувань?"
        controlKey="supportServices"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином ЗВО створює достатні умови для реалізації права на освіту особами з особливими освітніми потребами? Наведіть конкретні приклади створення таких умов на ОП (якщо такі були)"
        controlKey="specialNeedsPeopleEducation"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином у ЗВО визначено політику та процедури врегулювання конфліктних ситуацій (включаючи пов’язаних із сексуальними домаганнями, дискримінацією та корупцією)? Яким чином забезпечується доступність політики та процедур врегулювання для учасників освітнього процесу? Якою є практика їх застосування під час реалізації ОП?"
        controlKey="policyAndProceduresForConflictResolution"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C7EducationalEnvironmentAndMaterialResource extends BaseControlDirective implements OnInit {

  @Input()
  initialData: EducationalEnvironmentAndMaterialResource | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('educationalEnvironmentAndMaterialResource',
      this.fb.nonNullable.group({
        financialResources: ['', [Validators.maxLength(1500)]],
        educationalEnvironment: ['', [Validators.maxLength(1500)]],
        safetyMeasures: ['', [Validators.maxLength(1500)]],
        supportServices: ['', [Validators.maxLength(3000)]],
        specialNeedsPeopleEducation: ['', [Validators.maxLength(1500)]],
        policyAndProceduresForConflictResolution: ['', [Validators.maxLength(3000)]]
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('educationalEnvironmentAndMaterialResource')?.patchValue(this.initialData);
  }
}
