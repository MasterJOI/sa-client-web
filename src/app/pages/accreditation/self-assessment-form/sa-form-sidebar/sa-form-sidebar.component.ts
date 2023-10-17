import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EducationProgramsStore} from '../../../../services/education-programs.store';
import { AdviceService } from 'src/app/services/advice.service';

@Component({
  selector: 'app-sa-form-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside id="default-sidebar" aria-label="Sidebar">
      <div class="h-full pr-3 overflow-y-auto">
        <ul class="space-y-2 font-medium">
          <li *ngFor="let section of sections; trackBy:sectionTrackBy">
            <a
              [ngClass]="section.id === (activeSectionId$ | async) ? 'bg-primary-500' : ''"
              class="flex sections-center p-2 rounded group cursor-pointer" (click)="onSelectSection(section.id)">
              <p class="text-body text-gray-950 group-hover:text-secondary-700">{{section.label}}</p>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaFormSidebarComponent {

  private educationProgramsStore = inject(EducationProgramsStore);
  private adviceService = inject(AdviceService);


  activeSectionId$ = this.educationProgramsStore.activeSectionId;

  sections: { id: string, label: string }[] = [
    {id: 'c1', label: '1. Проектування та цілі освітньої програми'},
    {id: 'c2', label: '2. Структура та зміст освітньої програми'},
    {id: 'c3', label: '3. Доступ до освітньої програми та визнання результатів навчання'},
    {id: 'c4', label: '4. Навчання і викладання за освітньою програмою'},
    {id: 'c5', label: '5. Контрольні заходи, оцінювання здобувачів вищої освіти та академічна доброчесність'},
    {id: 'c6', label: '6. Людські ресурси'},
    {id: 'c7', label: '7. Освітнє середовище та матеріальні ресурси'},
    {id: 'c8', label: '8. Внутрішнє забезпечення якості освітньої програми'},
    {id: 'c9', label: '9. Прозорість і публічність'},
    {id: 'c10', label: '10. Навчання через дослідження'},
    {id: 'c11', label: '11. Перспективи подальшого розвитку ОП'},
    {id: 't1', label: 'Таблиця 1. Інформація про обов’язкові освітні компоненти ОП'},
    {id: 't2', label: 'Таблиця 2. Зведена інформація про викладачів'},
    {id: 't3', label: 'Таблиця 3. Матриця відповідності'},
  ];

  sectionTrackBy(index: number, section: { id: string, label: string }) {
    return section.id;
  }

  onSelectSection(sectionId: string) {
    this.adviceService.selectNewSection(sectionId);
  }
}
