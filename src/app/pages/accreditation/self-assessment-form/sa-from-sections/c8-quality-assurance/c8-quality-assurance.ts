import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {QualityAssurance} from '../../../../../dto/self_assessment/SelfAssessmentInfo';

@Component({
  selector: 'app-c8-quality-assurance',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent],
  template: `
    <div formGroupName="qualityAssurance" class="flex flex-col gap-4">
      <app-sa-form-textarea
        label="Яким документом ЗВО регулюються процедури розроблення, затвердження, моніторингу та періодичного перегляду освітніх програм? Наведіть посилання на цей документ, оприлюднений у відкритому доступі в мережі Інтернет"
        controlKey="regulatoryDocument"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, яким чином та з якою періодичністю відбувається перегляд ОП? Які зміни були внесені до ОП за результатами останнього перегляду, чим вони були обґрунтовані?"
        controlKey="educationProgramReview"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, із посиланням на конкретні приклади, як здобувачі вищої освіти залучені до процесу періодичного перегляду ОП та інших процедур забезпечення її якості, а їх позиція береться до уваги під час перегляду ОП"
        controlKey="involvementOfStudents"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Яким чином студентське самоврядування бере участь у процедурах внутрішнього забезпечення якості ОП"
        controlKey="studentSelfGovernment"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, із посиланням на конкретні приклади, як роботодавці безпосередньо або через свої об’єднання залучені до процесу періодичного перегляду ОП та інших процедур забезпечення її якості"
        controlKey="involvementOfEmployers"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть практику збирання та врахування інформації щодо кар’єрного шляху та траєкторій працевлаштування випускників ОП"
        controlKey="alumniEmployment"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Які недоліки в ОП та/або освітній діяльності з реалізації ОП були виявлені у ході здійснення процедур внутрішнього забезпечення якості за час її реалізації? Яким чином система забезпечення якості ЗВО відреагувала на ці недоліки?"
        controlKey="qualityIssues"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, що результати зовнішнього забезпечення якості вищої освіти беруться до уваги під час удосконалення ОП. Яким чином зауваження та пропозиції з останньої акредитації та акредитацій інших ОП були ураховані під час удосконалення цієї ОП?"
        controlKey="educationalProgramImprovement"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, яким чином учасники академічної спільноти змістовно залучені до процедур внутрішнього забезпечення якості ОП?"
        controlKey="academicCommunityMembersEngaging"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть розподіл відповідальності між різними структурними підрозділами ЗВО у контексті здійснення процесів і процедур внутрішнього забезпечення якості освіти"
        controlKey="structuralUnitsResponsibilitiesDistribution"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C8QualityAssurance extends BaseControlDirective implements OnInit {

  @Input()
  initialData: QualityAssurance | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('qualityAssurance',
      this.fb.nonNullable.group({
        regulatoryDocument: ['', [Validators.maxLength(1500)]],
        educationProgramReview: ['', [Validators.maxLength(3000)]],
        involvementOfStudents: ['', [Validators.maxLength(1500)]],
        studentSelfGovernment: ['', [Validators.maxLength(1500)]],
        involvementOfEmployers: ['', [Validators.maxLength(1500)]],
        alumniEmployment: ['', [Validators.maxLength(1500)]],
        qualityIssues: ['', [Validators.maxLength(3000)]],
        educationalProgramImprovement: ['', [Validators.maxLength(3000)]],
        academicCommunityMembersEngaging: ['', [Validators.maxLength(1500)]],
        structuralUnitsResponsibilitiesDistribution: ['', [Validators.maxLength(1500)]],
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('qualityAssurance')?.patchValue(this.initialData);
  }
}
