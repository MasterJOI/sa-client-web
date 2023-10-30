
export interface EducationProgramsData {
  data: EducationProgram[]
  totalRecords: number
}

export interface EducationProgram {
  id: string
  educationProgramId: number
  cycle: string
  specialty: string
  specialtyCode: number
  name: string
  programType: string
  status: string
}
