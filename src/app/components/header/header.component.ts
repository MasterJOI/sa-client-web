import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogoComponent} from '../logo/logo.component';
import {AuthStore} from '../../services/auth.store';
import {RouterLink} from '@angular/router';
import {CurrentUser} from '../../dto/auth/CurrentUser';
import {Observable} from 'rxjs';
import {Flowbite} from 'src/app/util/flowbite.decorator';
import {Menu, MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';

@Flowbite()
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LogoComponent, RouterLink, MenuModule],
  template: `
    <nav class="bg-primary-500 w-full">
      <div class="flex flex-wrap items-center justify-between mx-auto px-4 md:px8 xl:px-16 py-2.5">
        <a [routerLink]="['/']">
          <app-logo [width]="48" [height]="48"></app-logo>
        </a>

        <ng-container *ngIf="currentUser$ | async as currentUser">
          <button data-collapse-toggle="navbar-dropdown" type="button"
                  class="inline-flex items-center p-2 ml-3 w-10 h-10 justify-center text-sm text-gray-800 rounded-lg md:hidden hover:bg-gray-800 hover:text-gray-0  focus:outline-none focus:ring-2 focus:ring-gray-950"
                  aria-controls="navbar-dropdown" aria-expanded="false">
            <span class="sr-only">Відкрити головне меню</span>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>

          <div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
            <ul
              class="flex flex-col items-center font-medium mt-4 rounded-lg md:flex-row md:space-x-2 md:mt-0 md:text-sm">

              <li class="flex items-center justify-between gap-2">

                <p-menu #userMenu [model]="userActions" [popup]="true" appendTo="body"></p-menu>
                <button (click)="setUserActions($event)"
                        class="flex items-center justify-between gap-1 w-full py-2 pl-3 pr-4  text-gray-800 md:hover:bg-transparent md:border-0 md:hover:text-gray-600 md:p-0 md:w-auto">
                  <div
                    class="flex justify-center items-center relative w-10 h-10 overflow-hidden rounded-full border border-gray-950">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill="#333333"/>
                    </svg>
                  </div>
                  {{currentUser.name}}
                  <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                       viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m1 1 4 4 4-4"/>
                  </svg>

                </button>

                <div class="w-px h-8 bg-gray-600"></div>
                <span class="text-gray-800">{{currentUser.username}}</span>
              </li>

            </ul>
          </div>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  private authStore = inject(AuthStore);
  currentUser$ = new Observable<CurrentUser | null>();

  @ViewChild('userMenu') userMenu!: Menu;
  userActions: MenuItem[] = [];

  logout() {
    this.authStore.logOut();
  }

  ngOnInit() {
    this.currentUser$ = this.authStore.user$;
  }

  setUserActions($event: MouseEvent) {
    this.userMenu.toggle($event);
    this.userActions = [
      {
        label: 'Аккаунт',
        icon: 'pi pi-user',
        routerLink: ['/accreditation']
      },
      {
        label: 'Вийти',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];
  }
}
