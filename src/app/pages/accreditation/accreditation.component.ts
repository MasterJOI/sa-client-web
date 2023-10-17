import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardItemComponent} from '../card-menu/card-item/card-item.component';
import {EducationProgramsTableComponent} from './education-programs-table/education-programs-table.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-accreditation',
  standalone: true,
  imports: [CommonModule, CardItemComponent, EducationProgramsTableComponent, RouterOutlet],
  template: `
    <div class="flex w-full h-[calc(100vh-68px)] items-center justify-center">
      <div
        class="p-12 m-auto h-[calc(100vh-68px)] w-full">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccreditationComponent {
}
