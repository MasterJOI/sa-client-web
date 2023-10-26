import {ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicValidatorMessage} from '../../../../forms/error/dynamic-validator-message.directive';
import {ControlContainer, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subdivision} from '../../../../dto/subdivision/Subdivision';
import {cycles} from '../../../../util/constants';
import {DropdownModule} from 'primeng/dropdown';
import {SubdivisionsService} from '../../../../services/subdivisions.service';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ],
  imports: [CommonModule, DynamicValidatorMessage, FormsModule, ReactiveFormsModule, DropdownModule],
  template: `
    <fieldset formGroupName="teacher">
      <legend>Викладач</legend>
      <div class="form-field">
        <label for="hireDate">Дата прийняття на роботу</label>
        <input formControlName="hireDate" type="date" id="hireDate">
      </div>
      <div class="form-field">
        <label for="subdivisionId">Структурний підрозділ</label>
        <p-dropdown id="subdivisionId"
                    styleClass="w-full"
                    [options]="subdivisions"
                    formControlName="subdivisionId"
                    optionLabel="name"
                    optionValue="id"
        ></p-dropdown>
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
  private subdivisionsService = inject(SubdivisionsService);

  @Input()
  subdivisions: Subdivision[] = [];

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl('teacher',
      this.fb.nonNullable.group({
        hireDate: ['', [Validators.required]],
        subdivisionId: [this.subdivisions[0].id, [Validators.required]],
        teacherId: ['', [Validators.required]],
      }));
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl('teacher');
  }

  protected readonly cycles = cycles;
}
