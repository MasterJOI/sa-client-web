import {Component, HostBinding, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseDynamicControl, comparatorFn, dynamicControlProvider} from './base-dynamic-control';
import {AbstractControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ControlInjectorPipe} from '../control-injector.pipe';
import {DynamicControlResolver} from '../dynamic-control-resolver.service';
import {passwordShouldMatch} from '../validators/password-should-match.validator';

@Component({
  selector: 'app-dynamic-group',
  standalone: true,
  viewProviders: [
    dynamicControlProvider
  ],
  imports: [CommonModule, ReactiveFormsModule, ControlInjectorPipe],
  template: `
    <fieldset [formGroupName]="control.controlKey">
      <legend>{{control.config.label}}</legend>
      <ng-container *ngFor="let control of control.config.controls | keyvalue: comparatorFn">
        <ng-container
          [ngComponentOutlet]="dynamicControlResolver.resolve(control.value.controlType) | async"
          [ngComponentOutletInjector]="control.key | controlInjector: control.value"
        ></ng-container>

      </ng-container>
    </fieldset>
  `,
  styles: []
})
export class DynamicGroupComponent extends BaseDynamicControl implements OnInit {

  // override class form-field in formGroup component
  //@HostBinding('class') override hostClass = '';

  dynamicControlResolver = inject(DynamicControlResolver);

  protected readonly comparatorFn = comparatorFn;

  override formControl: AbstractControl = new FormGroup({});

  constructor() {
    super();
    this.formControl.addValidators(this.resolveValidators(this.control.config));
  }
}
