import {AfterViewInit, Directive, inject, OnInit, StaticProvider} from '@angular/core';
import {ControlContainer, FormBuilder, FormGroup} from '@angular/forms';


export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, {skipSelf: true})
}

@Directive({
  selector: '[appBaseControl]',
  standalone: true,
})
export class BaseControlDirective {

  parentContainer = inject(ControlContainer);
  fb = inject(FormBuilder);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnDestroy() {
    //this.parentFormGroup.removeControl('programDesign');
  }

}
