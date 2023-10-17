import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SaModalComponent} from '../sa-modal.component';
import {ButtonComponent} from '../../button/button.component';

@Component({
  selector: 'app-dialog-action',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <app-button
      classes="button--danger h-12"
      (onCLick)="onSubmitted()">
      Так, я впевнений.
    </app-button>
    <app-button
      classes="button--outlined h-12"
      (onCLick)="onDeclined()">
      Ні, відмінити.
    </app-button>
  `,
  styles: [
  ]
})
export class DialogActionComponent {

  saModal = inject(SaModalComponent);

  onSubmitted() {
    this.saModal.submitted.next(true);
  }

  onDeclined() {
    this.saModal.submitted.next(false);
  }
}
