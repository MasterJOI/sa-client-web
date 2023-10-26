import {
  ControlMeasuresAndAcademicIntegrity,
  EducationalEnvironmentAndMaterialResource,
  EducationalProgram,
  EducationalProgramAccess,
  EducationalProgramLearningAndTeaching,
  EducationalProgramStructureAndContent,
  EducationalTransparencyAndPublicity,
  HumanResource,
  OpDevelopmentPerspective,
  ProgramDesign,
  QualityAssurance
} from './SelfAssessmentInfo';

export class CriteriaUpdateRequestBody {
  general?: ChangedFields<any>
  programDesign?: ChangedFields<ProgramDesign>
  structureAndContent?: ChangedFields<EducationalProgramStructureAndContent>
  programAccess?: ChangedFields<EducationalProgramAccess>
  learningAndTeaching?: ChangedFields<EducationalProgramLearningAndTeaching>
  controlMeasuresAndAcademicIntegrity?: ChangedFields<ControlMeasuresAndAcademicIntegrity>
  humanResource?: ChangedFields<HumanResource>
  educationalEnvironmentAndMaterialResource?: ChangedFields<EducationalEnvironmentAndMaterialResource>
  qualityAssurance?: ChangedFields<QualityAssurance>
  transparencyAndPublicity?: ChangedFields<EducationalTransparencyAndPublicity>
  educationalProgram?: ChangedFields<EducationalProgram>
  developmentPerspective?: ChangedFields<OpDevelopmentPerspective>
}

export type ChangedFields<T> = {
  [key: string]: Partial<T[keyof T]>;
};
