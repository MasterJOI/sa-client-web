import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicValidatorMessage} from '../../../../forms/error/dynamic-validator-message.directive';
import {ControlContainer, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-student-form',
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ],
  imports: [CommonModule, DynamicValidatorMessage, FormsModule, ReactiveFormsModule],
  template: `
    <fieldset formGroupName="student">
      <legend>Студент</legend>
      <div class="form-field">
        <label for="enrollmentDate">Дата вступу в заклад освіти</label>
        <input formControlName="enrollmentDate" type="date" id="enrollmentDate">
      </div>
      <div class="form-field">
        <label for="studentType">Освітній ступінь</label>
        <select id="studentType" formControlName="studentType">
          <option *ngFor="let type of studentTypes; let i = index" [value]="i">{{type}}</option>
        </select>
      </div>
      <div class="form-field">
        <label for="studentId">Унікальний номер у системі</label>
        <input formControlName="studentId" type="text" id="studentId"
               placeholder="Введть свій номер студентського квитка">
      </div>
    </fieldset>

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentFormComponent implements OnInit, OnDestroy {
  studentTypes = ['Баклавр', 'Магістр', 'Аспірант'];

  parentContainer = inject(ControlContainer);
  fb = inject(FormBuilder);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl('student',
      this.fb.nonNullable.group({
        enrollmentDate: ['', [Validators.required]],
        studentType: this.fb.nonNullable.control(
          this.studentTypes[this.studentTypes.length - 1],
          Validators.required
        ),
        studentId: ['', [Validators.required]],
      }));
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl('student');
  }
}
