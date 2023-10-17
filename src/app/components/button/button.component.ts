import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
        <button class="reusable-button {{classes}}"
                [type]="type"
                [attr.form]="form"
                [disabled]="disabled"
                (click)="onCLick.emit()"
                (submit)="onCLick.emit()"
        >
            <ng-content></ng-content>
        </button>
    `,
    styles: [
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {

    @Input()
    type = 'button';

    @Input()
    classes = '';


    @Input()
    form: string | null = null;

    @Input()
    disabled = false;

    @Output()
    onCLick = new EventEmitter<void>();

}
