import {AfterViewInit, Directive, inject, Input} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {EducationProgramsStore} from '../../../../services/education-programs.store';

@Directive({
  selector: '[initForm]',
  standalone: true,
})
export class InitFormDirective implements AfterViewInit {

  private parentContainer = inject(ControlContainer);
  private educationProgramsStore = inject(EducationProgramsStore);

  @Input()
  formName = '';

  ngAfterViewInit() {
    this.setInitialFormValues();
  }

  setInitialFormValues() {
    const initialFormValues = this.educationProgramsStore.initialFormValues.getValue();
    if (!(this.formName in initialFormValues)) {
      initialFormValues[this.formName] = this.parentContainer.value;
      this.educationProgramsStore.initialFormValues.next(initialFormValues);
    }
  }
}
