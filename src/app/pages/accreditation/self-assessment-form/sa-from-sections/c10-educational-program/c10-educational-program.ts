import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseControlDirective, dynamicControlProvider} from '../base-control.directive';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {SaFormTextareaComponent} from '../../sa-form-textarea/sa-form-textarea.component';
import {EducationalProgram} from '../../../../../dto/self_assessment/SelfAssessmentInfo';

@Component({
  selector: 'app-c10-educational-program',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, ReactiveFormsModule, SaFormTextareaComponent],
  template: `
    <div formGroupName="educationalProgram" class="flex flex-col gap-4">
      <app-sa-form-textarea
        label="Продемонструйте, що зміст освітньо-наукової програми відповідає науковим інтересам аспірантів (ад’юнктів)"
        controlKey="description"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, яким чином зміст освітньо-наукової програми забезпечує повноцінну підготовку здобувачів вищої освіти до дослідницької діяльності за спеціальністю та/або галуззю"
        controlKey="researchPreparation"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть, яким чином зміст освітньо-наукової програми забезпечує повноцінну підготовку здобувачів вищої освіти до викладацької діяльності у закладах вищої освіти за спеціальністю та/або галуззю"
        controlKey="teachingPreparation"
        [maxCharacters]="3000"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте дотичність тем наукових досліджень аспірантів (ад’юнктів) напрямам досліджень наукових керівників"
        controlKey="supervisorRelevance"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть з посиланням на конкретні приклади, як ЗВО організаційно та матеріально забезпечує в межах освітньо-наукової програми можливості для проведення і апробації результатів наукових досліджень аспірантів (ад’юнктів)"
        controlKey="researchSupport"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Проаналізуйте, як ЗВО забезпечує можливості для долучення аспірантів (ад’юнктів) до міжнародної академічної спільноти за спеціальністю, наведіть конкретні проекти та заходи"
        controlKey="internationalParticipation"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть участь наукових керівників аспірантів (ад’юнктів) у дослідницьких проектах, результати яких регулярно публікуються та/або практично впроваджуються"
        controlKey="researchProjectsSupervisorsParticipation"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Опишіть чинні практики дотримання академічної доброчесності у науковій діяльності наукових керівників та аспірантів (ад’юнктів)"
        controlKey="academicIntegrityPractices"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
      <app-sa-form-textarea
        label="Продемонструйте, що ЗВО вживає заходів для виключення можливості здійснення наукового керівництва особами, які вчинили порушення академічної доброчесності"
        controlKey="academicIntegrityPreventingViolations"
        [maxCharacters]="1500"
      ></app-sa-form-textarea>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C10EducationalProgram extends BaseControlDirective implements OnInit {

  @Input()
  initialData: EducationalProgram | undefined;

  constructor() {
    super();
    this.parentFormGroup.addControl('educationalProgram',
      this.fb.nonNullable.group({
        description: ['', [Validators.maxLength(1500)]],
        researchPreparation: ['', [Validators.maxLength(3000)]],
        teachingPreparation: ['', [Validators.maxLength(3000)]],
        supervisorRelevance: ['', [Validators.maxLength(1500)]],
        researchSupport: ['', [Validators.maxLength(1500)]],
        internationalParticipation: ['', [Validators.maxLength(1500)]],
        researchProjectsSupervisorsParticipation: ['', [Validators.maxLength(1500)]],
        academicIntegrityPractices: ['', [Validators.maxLength(1500)]],
        academicIntegrityPreventingViolations: ['', [Validators.maxLength(1500)]],
      }));
  }

  ngOnInit() {
    this.parentFormGroup.get('educationalProgram')?.patchValue(this.initialData);
  }
}
