import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardItemComponent} from './card-item/card-item.component';

@Component({
  selector: 'app-card-menu',
  standalone: true,
  imports: [CommonModule, CardItemComponent],
  template: `
    <div class="flex w-full h-[calc(100vh-68px)] items-center justify-center bg-atomic bg-no-repeat bg-cover">
      <div
        class="p-12 scrollable m-auto h-[calc(100vh-68px)] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20">
        <app-card-item
          *ngFor="let card of cards"
          [label]="card.label"
          [imgUrl]="card.imgUrl"
          [path]="card.path"
        ></app-card-item>
      </div>
    </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardMenuComponent {

  cards = [
    {
      label: "Акредитація ОП",
      imgUrl: "assets/img/CheckList.png",
      path: "accreditation"
    },
    {
      label: "Освітні програми",
      imgUrl: "assets/img/Teach.png",
      path: "programs"
    },
    {
      label: "Опитування",
      imgUrl: "assets/img/Exam.png",
      path: "questioners"
    },
    {
      label: "Панель адміністратора",
      imgUrl: "assets/img/User.png",
      path: "admin"
    }
  ]
}
