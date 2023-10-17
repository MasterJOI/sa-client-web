import {Routes} from '@angular/router';

export const AccreditationRoutes: Routes = [
  {
    path: '',
    loadComponent:
      () => import('./accreditation.component')
        .then(m => m.AccreditationComponent),
    children: [
      {
        path: '',
        loadComponent:
          () => import('./education-programs-table/education-programs-table.component')
            .then(m => m.EducationProgramsTableComponent)
      },
      {
        path: ':educationProgramId',
        loadComponent:
          () => import('./self-assessment-form/self-assessment-form.component')
            .then(m => m.SelfAssessmentFormComponent),
      }
    ]
  },

]
