import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="bg-white flex justify-center items-center h-screen w-screen bg-atomic bg-no-repeat bg-cover">
      <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
          <h1 class="mb-4 text-7xl font-kharkiv-tone font-extrabold lg:text-9xl text-secondary-600">404</h1>
          <p class="mb-4 text-3xl font-kharkiv-tone font-bold text-gray-900 md:text-4xl">Щось пішло не так...</p>
          <p class="mb-4 text-lg font-light text-gray-500">Вибачте, ми не можемо знайти цю сторінку.</p>
          <a [routerLink]="['']" class="reusable-button button--primary">Повернутися на головну</a>
        </div>
      </div>
    </section>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {

}
