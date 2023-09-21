import {Component} from '@angular/core';
import {BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps} from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [...sharedDynamicControlDeps],
  viewProviders: [dynamicControlProvider],
  template: `
    <label [for]="control.controlKey">{{control.config.label}}</label>
    <input
      [id]="control.controlKey"
      [type]="control.config.type"
      [value]="control.config.value"
      [formControlName]="control.controlKey"
      [placeholder]="control.config.placeholder"
    >
  `
})
export class DynamicInputComponent extends BaseDynamicControl {
}
