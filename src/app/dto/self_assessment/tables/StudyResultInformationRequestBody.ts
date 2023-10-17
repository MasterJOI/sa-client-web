export class StudyResultInformationRequestBody {
  name: string;
  isCorresponds: boolean;
  componentCorrespondences: ComponentCorrespondence[];


  constructor(name: string, isCorresponds: boolean, componentCorrespondences: ComponentCorrespondence[]) {
    this.name = name;
    this.isCorresponds = isCorresponds;
    this.componentCorrespondences = componentCorrespondences;
  }
}

export interface ComponentCorrespondence {
  id: string;
  disciplineId: string;
  teachingMethod: string;
  assessmentForm: string;
}
