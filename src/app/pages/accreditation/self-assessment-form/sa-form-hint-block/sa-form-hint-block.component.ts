import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '../../../../components/button/button.component';
import {PageLoaderComponent} from '../../../../components/page-loader/page-loader.component';
import {Advise} from '../../../../dto/self_assessment/Advise';

@Component({
  selector: 'app-sa-form-hint-block',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PageLoaderComponent],
  template: `
    <div class="flex flex-col p-4 bg-primary-50 rounded gap-4 relative min-h-full h-auto w-full overflow-clip">

      <app-page-loader></app-page-loader>

      <ng-container *ngIf="advice">
        <div class="flex justify-between self-stretch gap-1">
          <div class="flex flex-col">
            <h2 class="text-title font-kharkiv-tone text-gray-950">Уточнювальні питання</h2>
            <p class="text-small text-gray-400">{{advice.maxCharacters === 1500 ? 'Коротке' : 'Довге'}} поле
              ({{advice.maxCharacters}} символів)</p>
          </div>
          <app-button
            classes="button--primary"
            (onCLick)="window.open('https://naqa.gov.ua/wp-content/uploads/2019/09/%D0%9F%D0%BE%D1%80%D0%B0%D0%B4%D0%BD%D0%B8%D0%BA-%D0%B4%D0%BB%D1%8F-%D0%97%D0%92%D0%9E-%D0%BE%D1%81%D1%82.pdf', '_blank')"
          >
            <span class="text-cta text-gray-950">Порадник</span>
          </app-button>
        </div>
        <div class="space-y-2">
          <p class="text-body text-gray-700 indent-3"
             *ngFor="let item of advice?.clarifyingQuestions?.split('?'); let last = last">
            {{item}}{{ !last ? '?' : '' }}
          </p>
        </div>
        <div class="space-y-2">
          <h2 class="text-title font-kharkiv-tone text-gray-950">Рекомендовані показники виконання</h2>
          <p class="text-body text-gray-700 indent-3">
            {{advice.recommendedIndicators}}
          </p>
        </div>
        <div class="space-y-2">
          <h2 class="text-title font-kharkiv-tone text-gray-950">Документи та інші матеріали, що ЗВО надає експертам в
            разі потреби</h2>
          <p class="text-body text-gray-700 indent-3">
            {{advice.documents}}
          </p>
        </div>
      </ng-container>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaFormHintBlockComponent {

  @Input()
  advice: Advise | undefined;

  protected readonly window = window;


}
