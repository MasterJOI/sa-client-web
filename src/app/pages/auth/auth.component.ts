import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageLoaderComponent} from '../../components/page-loader/page-loader.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, PageLoaderComponent],
  template: `
    <div class="flex h-screen w-screen items-center justify-center bg-atomic bg-no-repeat bg-cover">
      <div
        class="scrollable m-auto max-h-[80vh] w-[568px] p-10 bg-white rounded-xl shadow border-[3px] border-gray-950 flex-col justify-start items-center gap-3 inline-flex">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {

}
