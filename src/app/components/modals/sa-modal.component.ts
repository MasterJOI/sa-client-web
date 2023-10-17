import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Injector,
  Input,
  Output,
  TemplateRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Flowbite} from '../../util/flowbite.decorator';
import {DialogModule} from 'primeng/dialog';

@Flowbite()
@Component({
  selector: 'app-sa-modal',
  standalone: true,
  imports: [CommonModule, DialogModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      styleClass="sa-modal"
      [draggable]="false"
      [resizable]="false"
      [closable]="true"
      (onHide)="visibleChange.emit(false)"
    >
      <ng-template pTemplate="header">
        <ng-container
          [ngTemplateOutlet]="headerTemplate"
        ></ng-container>
      </ng-template>

      <ng-container
        *ngIf="contentTemplate"
        [ngTemplateOutlet]="contentTemplate"
        [ngTemplateOutletInjector]="injector"
      ></ng-container>

      <ng-template pTemplate="footer" *ngIf="footerTemplate">
        <ng-container
          [ngTemplateOutlet]="footerTemplate"
          [ngTemplateOutletInjector]="injector"
        ></ng-container>
      </ng-template>
    </p-dialog>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaModalComponent {

  @Input() visible: boolean = false;
  @Output() visibleChange:EventEmitter<any> = new EventEmitter();

  @Input() headerTemplate!: TemplateRef<any>;
  @Input() contentTemplate!: TemplateRef<any>;
  @Input() footerTemplate!: TemplateRef<any>;

  @Output() submitted:EventEmitter<any> = new EventEmitter();

  injector = inject(Injector);
}
