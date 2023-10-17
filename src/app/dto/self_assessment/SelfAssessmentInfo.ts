export interface SelfAssessmentInfo {
  id: string
  programDesign: ProgramDesign
  structureAndContent: EducationalProgramStructureAndContent
  programAccess: EducationalProgramAccess
  learningAndTeaching: EducationalProgramLearningAndTeaching
  controlMeasuresAndAcademicIntegrity: ControlMeasuresAndAcademicIntegrity
  humanResource: HumanResource
  educationalEnvironmentAndMaterialResource: EducationalEnvironmentAndMaterialResource
  qualityAssurance: QualityAssurance
  transparencyAndPublicity: EducationalTransparencyAndPublicity
  educationalProgram: EducationalProgram
  developmentPerspective: OpDevelopmentPerspective
  programEducationalComponentsInformation: {
    educationalComponents: ProgramEducationalComponent[]
  },
  teacherSummaryInformation: {
    teachers: TeacherInformation[]
  }
  studyResultsMatrix: {
    studyResults: StudyResult[]
  }
}

export interface ProgramDesign {
  goals: string;
  uniqueness: string;
  stakeholderStudent: string;
  stakeholderEmployer: string;
  stakeholderAcademic: string;
  stakeholderOther: string;
  marketTrends: string;
  industryAndRegionalContext: string;
  domesticAndForeignProgramsExperience: string;
  learningExperienceAchieve: string;
  nationalQualificationsLevel: string;
}

export interface EducationalProgramStructureAndContent {
  epCreditsAmount: number;
  componentsCreditsAmount: number;
  studentElectivesCreditsAmount: number;
  contentCompliance: string;
  individualLearningPath: string;
  studentChoiceRight: string;
  studentPracticalTraining: string;
  studentSoftSkills: string;
  relevantProfessionalStandard: string;
  componentsScopeCorrelatingApproach: string;
  dualFormEducationStructure: string;
}

export interface EducationalProgramAccess {
  admissionRulesLink: string;
  admissionRequirements: string;
  recognitionOfEducationResultsAccessibility: string;
  admissionRequirementsApplyingRulesPractice: string;
  recognitionOfEducationResultsDoc: string;
  educationResultsDocApplyingRulesPractice: string;
}

export interface EducationalProgramLearningAndTeaching {
  learningAndTeachingMethods: string;
  studentCenteredApproach: string;
  academicFreedom: string;
  learningOutcomes: string;
  learningAndResearch: string;
  curriculumUpdate: string;
  internationalization: string;
}

export interface ControlMeasuresAndAcademicIntegrity {
  description: string;
  clarityCriteria: string;
  informationProvision: string;
  complianceRequirements: string;
  accessibilityCertificationProcedure: string;
  objectivityProcedures: string;
  repeatingControlMeasuresProcedures: string;
  appealProcedureAndResultsOfControlMeasures: string;
  policiesAndStandardsDocuments: string;
  combatingViolationsOfAcademicIntegritySolutions: string;
  promotingAcademicIntegrity: string;
  respondingToViolationsOfAcademicIntegrity: string;
}

export interface HumanResource {
  competencyLevel: string;
  employersEngagement: string;
  expertInvolvement: string;
  teacherDevelopment: string;
  teachingExcellence: string;
}

export interface EducationalEnvironmentAndMaterialResource {
  financialResources: string;
  educationalEnvironment: string;
  safetyMeasures: string;
  supportServices: string;
  specialNeedsPeopleEducation: string;
  policyAndProceduresForConflictResolution: string;
}

export interface QualityAssurance {
  regulatoryDocument: string;
  educationProgramReview: string;
  involvementOfStudents: string;
  studentSelfGovernment: string;
  involvementOfEmployers: string;
  alumniEmployment: string;
  qualityIssues: string;
  educationalProgramImprovement: string;
  academicCommunityMembersEngaging: string;
  structuralUnitsResponsibilitiesDistribution: string;
}

export interface EducationalTransparencyAndPublicity {
  regulatoryDocuments: string;
  stakeholderFeedbackLink: string;
  educationalProgramLink: string;
}

export interface EducationalProgram {
  description: string;
  researchPreparation: string;
  teachingPreparation: string;
  supervisorRelevance: string;
  researchSupport: string;
  internationalParticipation: string;
  researchProjectsSupervisorsParticipation: string;
  academicIntegrityPractices: string;
  academicIntegrityPreventingViolations: string;
}

export interface OpDevelopmentPerspective {
  strongWeakPoints: string;
  futureDevelopment: string;
}

export interface ProgramEducationalComponent {
  id: string;
  componentName: string;
  componentType: number;
  documentName: string;
  documentPath: string;
  specialEquipmentInfo: string;
}

export interface TeacherInformation {
  id: string;
  teacherId: string;
  name: string;
  teacherPosition: string;
  subdivision: string;
  teacherQualification: string;
  teacherExperience: number;
  disciplines: EducationDiscipline[] | null;
  rationale: string;
}

export interface StudyResult {
  id: string;
  name: string;
  isCorresponds: boolean;
  componentCorrespondences: EducationComponentCorrespondence[];
}

export interface EducationComponentCorrespondence {
  id: string;
  discipline: EducationDiscipline;
  teachingMethod: string;
  assessmentForm: string;
}

export interface EducationDiscipline {
  id: string
  name: string
}
