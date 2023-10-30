import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="w-full bg-white border-[3px] border-gray-900 rounded shadow group hover:border-primary-600 transition duration-300 ease-in-out">
      <a [routerLink]="[path]">
        <div class="flex justify-center items-center py-16">
          <img class="" [src]="imgUrl" alt="" width="128" height="128"/>
        </div>
        <div class="flex justify-center items-center p-8 h-[130px] bg-gray-900 group-hover:bg-primary-500 transition duration-300 ease-in-out">
          <p class="text-gray-0 text-center font-kharkiv-tone text-xl group-hover:text-gray-950">{{label}}</p>
        </div>
      </a>
    </div>
  `,
  styles: [
    `:host {
      display: flex;
      width: 100%;
      align-items: center;
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardItemComponent {

  @Input({required: true})
  label = '';

  @Input({required: true})
  imgUrl = '';

  @Input({required: true})
  path = '';
}
