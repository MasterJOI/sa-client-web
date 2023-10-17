import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from '../auth.component';
import {LogoComponent} from '../../../components/logo/logo.component';
import {FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '../../../components/button/button.component';
import {Router, RouterLink} from '@angular/router';
import {DynamicValidatorMessage} from '../../../forms/error/dynamic-validator-message.directive';
import {AuthStore} from '../../../services/auth.store';
import {LoadingService} from '../../../services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [
    LoadingService
  ],
  imports: [CommonModule, AuthComponent, LogoComponent, ReactiveFormsModule, ButtonComponent, RouterLink, DynamicValidatorMessage],
  template: `
    <app-auth>
      <div class="flex flex-col items-center">
        <app-logo></app-logo>
        <span class="self-stretch text-center text-gray-950 text-3xl font-normal font-kharkiv-tone leading-loose">
          Вхід
        </span>
      </div>
      <div class="flex flex-col gap-3 w-full">
        <form id="loginForm"
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
              class="flex flex-col gap-2.5"
        >
          <div class="form-field">
            <label for="username">Логін</label>
            <input formControlName="username" type="text" id="username" placeholder="Введть свій логін">
          </div>
          <div class="form-field">
            <label for="password">Пароль</label>
            <input formControlName="password" type="password" id="password" placeholder="Введіть пароль">
          </div>
        </form>
        <span
          class="text-end text-gray-400 text-input-message font-normal font-inter leading-tight"
        >
          <a [routerLink]="['/register']" class="text-link hover:underline">Зареєструватися.</a>
        </span>
        <app-button
          type="submit"
          form="loginForm"
          classes="button--primary h-12 w-full"
        >
          <p class="text-title">Увійти</p>
        </app-button>
      </div>
    </app-auth>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private loading = inject(LoadingService);

  form = this.fb.group({
    username: ['',
      {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[\w.]+$/)
        ]
      }
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  @ViewChild(FormGroupDirective)
  private formDir!: FormGroupDirective

  ngOnInit() {
  }

  protected onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = {
      username: this.form.get('username')?.value!,
      password: this.form.get('password')?.value!
    }

    const login$ = this.authStore.login(user);

    this.loading.showLoaderUntilCompleted(login$)
      .subscribe();
  }
}
