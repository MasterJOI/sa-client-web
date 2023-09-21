import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
      <img
        [width]="width"
        [height]="height"
        src="assets/img/logo.svg"
        alt="Logo">
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {
  @Input()
  width = 64;
  @Input()
  height = 64;
}
