import {ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '../../../components/button/button.component';
import {SaFormSidebarComponent} from './sa-form-sidebar/sa-form-sidebar.component';
import {SaFormMainComponent} from './sa-form-main/sa-form-main.component';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SaFormHintBlockComponent} from './sa-form-hint-block/sa-form-hint-block.component';
import {EducationProgramsStore} from '../../../services/education-programs.store';
import {
  T1ProgramComponentsInformationComponent
} from './sa-from-sections/t1-program-components-information/t1-program-components-information.component';
import {C1ProgramDesignComponent} from './sa-from-sections/c1-program-design/c1-program-design.component';
import {
  T2TeacherSummaryInformationComponent
} from './sa-from-sections/t2-teacher-summary-information/t2-teacher-summary-information.component';
import {BehaviorSubject, Observable, startWith} from 'rxjs';
import {PageLoaderComponent} from '../../../components/page-loader/page-loader.component';
import {AdviceService} from '../../../services/advice.service';
import {LoadingService} from '../../../services/loading.service';
import {ProgramTypePipe} from '../../../pipes/program-type.pipe';

@Component({
  selector: 'app-self-assessment-form',
  standalone: true,
  providers: [
    LoadingService,
    AdviceService
  ],
  imports: [CommonModule, ButtonComponent, SaFormSidebarComponent, SaFormMainComponent, SaFormHintBlockComponent, T1ProgramComponentsInformationComponent, C1ProgramDesignComponent, T2TeacherSummaryInformationComponent, PageLoaderComponent, ProgramTypePipe],
  templateUrl: './self-assessment-form.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelfAssessmentFormComponent implements OnInit {

  @ViewChild('mainSection')
  public mainSection!: ElementRef<HTMLElement>;

  @HostListener('window:beforeunload')
  canDeactivate(): boolean | Observable<boolean> {
    return !this.isUnsavedChangesSubject.getValue();
  }

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isUnsavedChangesSubject = new BehaviorSubject<boolean>(false);

  private educationProgramsStore = inject(EducationProgramsStore);
  private adviceService = inject(AdviceService)

  advice$ = this.adviceService.selectedInputAdvice$;
  isHintHidden$ = this.adviceService.isHintHidden$;
  activeSectionId$ = this.educationProgramsStore.activeSectionId;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const programId = +params['educationProgramId'];
      if (isNaN(programId)) {
        this.router.navigate(['/404']);
        return;
      }

      this.educationProgramsStore.loadSelfAssessmentInfo(programId);
    });
  }

  onFormClose() {
    this.router.navigate(['/accreditation']);
  }

  protected readonly startWith = startWith;
}
