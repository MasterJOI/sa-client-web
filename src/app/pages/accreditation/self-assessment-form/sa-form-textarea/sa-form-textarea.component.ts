import {ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicValidatorMessage} from '../../../../forms/error/dynamic-validator-message.directive';
import {PaginatorModule} from 'primeng/paginator';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {TextFieldModule} from '@angular/cdk/text-field';
import {SaFormHintBlockComponent} from '../sa-form-hint-block/sa-form-hint-block.component';
import {BaseControlDirective, dynamicControlProvider} from '../sa-from-sections/base-control.directive';
import {ValidatorMessageContainer} from '../../../../forms/error/input-error/validator-message-container.directive';
import {AdviceService} from '../../../../services/advice.service';

@Component({
  selector: 'app-sa-form-textarea',
  standalone: true,
  viewProviders: [dynamicControlProvider],
  imports: [CommonModule, DynamicValidatorMessage, PaginatorModule, ReactiveFormsModule, TextFieldModule, SaFormHintBlockComponent, ValidatorMessageContainer],
  template: `
    <div class="form-field">
      <div class="flex justify-between items-start gap-2">
        <label [for]="controlKey">
          {{label}}
        </label>
        <ng-container *ngIf="!noAdvice">
          <img
            class="bg-primary-400 border-2 border-primary-400 rounded-full cursor-pointer"
            src="assets/icons/ic_hint.svg"
            alt="Показати підказку"
            title="Показати підказку"
            (click)="onHintClicked(controlKey, label, maxCharacters)"
          >
        </ng-container>
      </div>
      <div class="relative flex flex-col items-start gap-2">
        <textarea
          #textareaRef
          cdkTextareaAutosize
          cdkAutosizeMinRows="2"
          cdkAutosizeMaxRows="7"
          [formControlName]="controlKey"
          type="text"
          [id]="controlKey"
          placeholder="Ваша відповідь"
          class="pb-6"
          [errorContainer]="containerDir.container"
        ></textarea>
        <div *ngIf="!noCounter"
             class="absolute bottom-1 right-4 text-gray-600"
        >{{textareaRef.value.length}} / {{maxCharacters}}</div>
      </div>
      <ng-container validatorMessageContainer #containerDir="validatorMessageContainer"></ng-container>
    </div>
  `,
  styles: []
})
export class SaFormTextareaComponent extends BaseControlDirective implements OnInit, OnDestroy {

  @Input()
  label = '';

  _controlKey = '';
  get controlKey(): string {
    return this._controlKey;
  }

  @Input() set controlKey(value: string) {
    this._controlKey = value;
    //this.cd.markForCheck();
  }

  @Input()
  maxCharacters = 1500;

  @Input()
  noAdvice = false;

  @Input()
  noCounter = false;

  @Input()
  disabled = false;

  private adviceService = inject(AdviceService)

  onHintClicked(controlKey: string, label: string, maxCharacters: number) {
    this.adviceService.onSelectInputHint(controlKey, label, maxCharacters);
  }

  ngOnInit() {
    this.parentFormGroup.addControl(this.controlKey,
      this.fb.control({value: '', disabled: this.disabled}, Validators.maxLength(this.maxCharacters)));
  }
}
