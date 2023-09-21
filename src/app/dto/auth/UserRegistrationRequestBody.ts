interface StudentRegistrationRequestBody {
  studentId: string
  studentType: number
  enrollmentDate: Date
}

interface TeacherRegistrationRequestBody {
  teacherId: string
  subdivisions: string[]
  hireDate: Date
}

export interface UserRegistrationRequestBody {
  name: string
  username: string
  email: string
  password: string
  role: string
  birthDate: Date
  phoneNumber: string
  address: string
  student?: StudentRegistrationRequestBody
  teacher?: TeacherRegistrationRequestBody
}
