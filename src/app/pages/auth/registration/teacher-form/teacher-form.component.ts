import {ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicValidatorMessage} from '../../../../forms/error/dynamic-validator-message.directive';
import {ControlContainer, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subdivision} from '../../../../dto/subdivision/Subdivision';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ],
  imports: [CommonModule, DynamicValidatorMessage, FormsModule, ReactiveFormsModule],
  template: `
    <fieldset formGroupName="teacher">
      <legend>Викладач</legend>
      <div class="form-field">
        <label for="hireDate">Дата прийняття на роботу</label>
        <input formControlName="hireDate" type="date" id="hireDate">
      </div>
      <div class="form-field">
        <label for="subdivision">Структурний підрозділ</label>
        <select multiple id="subdivision" formControlName="subdivisions">
          <option *ngFor="let subdivision of subdivisions"
                  [value]="subdivision.id">{{subdivision.name}}</option>
        </select>
      </div>
      <div class="form-field">
        <label for="teacherId">Унікальний номер у системі</label>
        <input formControlName="teacherId" type="text" id="teacherId"
               placeholder="Введть свій ID викладача в ЄДБО">
      </div>
    </fieldset>

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherFormComponent implements OnInit, OnDestroy {

  parentContainer = inject(ControlContainer);
  fb = inject(FormBuilder);

  @Input()
  subdivisions: Subdivision[] = [];

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl('teacher',
      this.fb.nonNullable.group({
        hireDate: ['', [Validators.required]],
        subdivisions: this.fb.nonNullable.control(
          [this.subdivisions],
          Validators.required
        ),
        teacherId: ['', [Validators.required]],
      }));
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl('teacher');
  }
}
