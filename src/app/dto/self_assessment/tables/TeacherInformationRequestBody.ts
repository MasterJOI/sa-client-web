export class TeacherInformationRequestBody {
  teacherId: string;
  teacherQualification: string;
  teacherExperience: number;
  rationale: string;
  disciplinesIDs: string[];


  constructor(teacherId: string, teacherQualification: string, teacherExperience: number, rationale: string, disciplinesIDs: string[]) {
    this.teacherId = teacherId;
    this.teacherQualification = teacherQualification;
    this.teacherExperience = teacherExperience;
    this.rationale = rationale;
    this.disciplinesIDs = disciplinesIDs;
  }
}
