import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '../../button/button.component';
import {DropdownModule} from 'primeng/dropdown';
import {DynamicValidatorMessage} from '../../../forms/error/dynamic-validator-message.directive';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {SaModalComponent} from '../sa-modal.component';
import {cycles, programTypes} from '../../../util/constants';
import {SpecialityService} from '../../../services/speciality.service';
import {PageLoaderComponent} from '../../page-loader/page-loader.component';

@Component({
  selector: 'app-create-program-form',
  standalone: true,
  providers: [
    SpecialityService
  ],
  imports: [CommonModule, ButtonComponent, DropdownModule, DynamicValidatorMessage, FormsModule, ReactiveFormsModule, PageLoaderComponent],
  template: `
    <div class="flex flex-col gap-5 w-full">
      <form id="creationForm"
            [formGroup]="form"
            (ngSubmit)="onCreationSubmit()"
            class="flex flex-col gap-2.5"
      >
        <div class="form-field">
          <label for="educationProgramId">ID освітньої програми в ЄДБО</label>
          <input
            formControlName="educationProgramId"
            type="number"
            id="educationProgramId"
          >
        </div>
        <div class="form-field">
          <label for="cycle">Рівень вищої освіти</label>
          <p-dropdown id="cycle"
                      styleClass="w-full"
                      [options]="cycles"
                      formControlName="cycle"
                      optionLabel="label"
                      optionValue="value"
          ></p-dropdown>
        </div>
        <div class="form-field">
          <label for="specialtyId">Спеціальність</label>
          <p-dropdown id="specialtyId"
                      styleClass="w-full"
                      [options]="(specialities$ | async)!"
                      formControlName="specialtyId"
                      optionLabel="name"
                      optionValue="id"
          >
            <ng-template let-specialty pTemplate="item">
              {{ specialty.code }} {{ specialty.name }}
            </ng-template>
          </p-dropdown>
        </div>
        <div class="form-field">
          <label for="name">Назва ОП</label>
          <input
            formControlName="name"
            type="text"
            id="name"
          >
        </div>
        <div class="form-field">
          <label for="programType">Тип ОП</label>
          <p-dropdown id="programType"
                      styleClass="w-full"
                      [options]="programTypes"
                      formControlName="programType"
                      optionLabel="label"
                      optionValue="value"
          ></p-dropdown>
        </div>
      </form>

      <app-button
        type="submit"
        form="creationForm"
        classes="button--primary h-12 w-full"
      >
        <p class="text-title">Створити</p>
      </app-button>
    </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProgramFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private specialityService = inject(SpecialityService);
  saModal = inject(SaModalComponent);

  specialities$ = this.specialityService.specialities$;

  form = this.fb.group({
    educationProgramId: ['', [Validators.required]],
    cycle: [cycles[0].value, [Validators.required]],
    specialtyId: ['', [Validators.required]],
    name: ['', [Validators.required]],
    programType: [programTypes[0].value, [Validators.required]]
  });

  ngOnInit() {
    this.specialityService.getSpecialities();
  }

  onCreationSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saModal.submitted.next(this.form.value);
  }

  protected readonly cycles = cycles;
  protected readonly programTypes = programTypes;
}
