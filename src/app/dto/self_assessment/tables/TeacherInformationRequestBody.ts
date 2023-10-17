export class TeacherInformationRequestBody {
  teacherId: string;
  disciplinesIDs: string[];

  constructor(teacherId: string, disciplinesIDs: string[]) {
    this.teacherId = teacherId;
    this.disciplinesIDs = disciplinesIDs;
  }
}
