import {AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SaFormTextareaComponent} from '../sa-form-textarea/sa-form-textarea.component';
import {SaFormHintBlockComponent} from '../sa-form-hint-block/sa-form-hint-block.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {EducationProgramsStore} from '../../../../services/education-programs.store';
import {C1ProgramDesignComponent} from '../sa-from-sections/c1-program-design/c1-program-design.component';
import {
  C2StructureAndContentComponent
} from '../sa-from-sections/c2-structure-and-content/c2-structure-and-content.component';
import {C3ProgramAccessComponent} from '../sa-from-sections/c3-program-access/c3-program-access.component';
import {
  C4LearningAndTeachingComponent
} from '../sa-from-sections/c4-learning-and-teaching/c4-learning-and-teaching.component';
import {
  C5ControlMeasuresAndAcademicIntegrity
} from '../sa-from-sections/c5-сontrol-measures-and-academic-integrity/c5-сontrol-measures-and-academic-integrity';
import {C8QualityAssurance} from '../sa-from-sections/c8-quality-assurance/c8-quality-assurance';
import {
  C9TransparencyAndPublicity
} from '../sa-from-sections/c9-transparency-and-publicity/c9-transparency-and-publicity';
import {C10EducationalProgram} from '../sa-from-sections/c10-educational-program/c10-educational-program';
import {
  T1ProgramComponentsInformationComponent
} from '../sa-from-sections/t1-program-components-information/t1-program-components-information.component';
import {C6HumanResource} from '../sa-from-sections/c6-human-resource/c6-human-resource';
import {
  C7EducationalEnvironmentAndMaterialResource
} from '../sa-from-sections/c7-educational-environment-and-material-resource/c7-educational-environment-and-material-resource';
import {C11DevelopmentPerspective} from '../sa-from-sections/c11-development-perspective/c11-development-perspective';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  T2TeacherSummaryInformationComponent
} from '../sa-from-sections/t2-teacher-summary-information/t2-teacher-summary-information.component';
import {
  T3StudyResultsInformationComponent
} from '../sa-from-sections/t3-study-results-information/t3-study-results-information.component';
import {ChangedFields, CriteriaUpdateRequestBody} from '../../../../dto/self_assessment/CriteriaUpdateRequestBody';
import * as _ from 'lodash';
import {GeneralComponent} from '../sa-from-sections/general/general.component';

@Component({
  selector: 'app-sa-form-main',
  standalone: true,
  imports: [CommonModule, SaFormTextareaComponent, SaFormHintBlockComponent, ReactiveFormsModule, C1ProgramDesignComponent, C2StructureAndContentComponent, C3ProgramAccessComponent, C4LearningAndTeachingComponent, C5ControlMeasuresAndAcademicIntegrity, C7EducationalEnvironmentAndMaterialResource, C8QualityAssurance, C9TransparencyAndPublicity, C10EducationalProgram, C11DevelopmentPerspective, T1ProgramComponentsInformationComponent, C6HumanResource, C7EducationalEnvironmentAndMaterialResource, C11DevelopmentPerspective, T2TeacherSummaryInformationComponent, T3StudyResultsInformationComponent, GeneralComponent],
  template: `
    <div *ngIf="selfAssessmentInfo$ | async as selfAssessmentInfo">
      <form
        id="saForm"
        class="sa-form"
        [formGroup]="saForm"
        (ngSubmit)="onSubmit()">
        <ng-container [ngSwitch]="activeSectionId$ | async">
          <app-general *ngSwitchCase="'g'"></app-general>
          <app-c1-program-design
            *ngSwitchCase="'c1'"
            [initialData]="selfAssessmentInfo.programDesign"
          ></app-c1-program-design>

          <app-c2-structure-and-content
            *ngSwitchCase="'c2'"
            [initialData]="selfAssessmentInfo.structureAndContent"
          ></app-c2-structure-and-content>

          <app-c3-program-access
            *ngSwitchCase="'c3'"
            [initialData]="selfAssessmentInfo.programAccess"
          ></app-c3-program-access>

          <app-c4-learning-and-teaching
            *ngSwitchCase="'c4'"
            [initialData]="selfAssessmentInfo.learningAndTeaching"
          ></app-c4-learning-and-teaching>

          <app-c5-control-measures-and-academic-integrity
            *ngSwitchCase="'c5'"
            [initialData]="selfAssessmentInfo.controlMeasuresAndAcademicIntegrity"
          ></app-c5-control-measures-and-academic-integrity>

          <app-c6-human-resource
            *ngSwitchCase="'c6'"
            [initialData]="selfAssessmentInfo.humanResource"
          ></app-c6-human-resource>

          <app-c7-educational-environment-and-material-resource
            *ngSwitchCase="'c7'"
            [initialData]="selfAssessmentInfo.educationalEnvironmentAndMaterialResource"
          ></app-c7-educational-environment-and-material-resource>

          <app-c8-quality-assurance
            *ngSwitchCase="'c8'"
            [initialData]="selfAssessmentInfo.qualityAssurance"
          ></app-c8-quality-assurance>

          <app-c9-transparency-and-publicity
            *ngSwitchCase="'c9'"
            [initialData]="selfAssessmentInfo.transparencyAndPublicity"
          ></app-c9-transparency-and-publicity>

          <app-c10-educational-program
            *ngSwitchCase="'c10'"
            [initialData]="selfAssessmentInfo.educationalProgram"
          ></app-c10-educational-program>

          <app-c11-development-perspective
            *ngSwitchCase="'c11'"
            [initialData]="selfAssessmentInfo.developmentPerspective"
          ></app-c11-development-perspective>

          <app-t1-program-components-information
            *ngSwitchCase="'t1'"
          ></app-t1-program-components-information>

          <app-t2-teacher-summary-information
            *ngSwitchCase="'t2'"
          ></app-t2-teacher-summary-information>

          <app-t3-study-results-information
            *ngSwitchCase="'t3'"
          ></app-t3-study-results-information>

        </ng-container>
      </form>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaFormMainComponent implements AfterViewInit {

  private hostEl = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  private educationProgramsStore = inject(EducationProgramsStore);
  selfAssessmentInfo$ = this.educationProgramsStore.selfAssessmentInfo$;
  activeSectionId$ = this.educationProgramsStore.activeSectionId;
  private fb = inject(FormBuilder);

  saForm = this.fb.group({});

  ngAfterViewInit() {
    this.activeSectionId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() =>
      this.hostEl.nativeElement.parentElement.scrollTo(0, 0)
    );
  }

  onSubmit() {
    const formData = this.saForm.value;
    const initialFormValues = this.educationProgramsStore.initialFormValues.getValue();
    const changedFields = this.getChangedFields(initialFormValues, formData);

    if (Object.keys(changedFields).length !== 0) {
      this.educationProgramsStore.saveChangedCriteria(this.educationProgramsStore.getSelfAssessmentId()!, changedFields);
    }
  }

  private getChangedFields(objectData: any, formData: any): ChangedFields<CriteriaUpdateRequestBody> {
    const changedFields: ChangedFields<CriteriaUpdateRequestBody> = {};

    for (const key of Object.keys(formData)) {
      if (_.isEqual(objectData[key], formData[key])) {
        continue;
      }

      if (typeof objectData[key] === 'object' && typeof formData[key] === 'object') {
        const subObjectChangedFields: any = {};

        for (const subKey of Object.keys(formData[key])) {
          if (!_.isEqual(objectData[key][subKey], formData[key][subKey])) {
            subObjectChangedFields[subKey] = formData[key][subKey];
          }
        }

        if (Object.keys(subObjectChangedFields).length > 0) {
          changedFields[key] = subObjectChangedFields;
        }
      } else {
        changedFields[key] = formData[key];
      }
    }

    return changedFields;
  }
}
