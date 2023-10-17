import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '../../components/header/header.component';
import {RouterOutlet} from '@angular/router';
import {PageLoaderComponent} from '../../components/page-loader/page-loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterOutlet, PageLoaderComponent],
  template: `
    <div>
      <app-header></app-header>
      <main class="relative">
        <router-outlet></router-outlet>
      </main>
      <app-page-loader></app-page-loader>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

}
