import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from '../auth.component';
import {LogoComponent} from '../../../components/logo/logo.component';
import {FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators} from '@angular/forms';
import {ControlInjectorPipe} from '../../../forms/control-injector.pipe';
import {ButtonComponent} from '../../../components/button/button.component';
import {Router, RouterLink} from '@angular/router';
import {BehaviorSubject, catchError, map, Observable, of, throwError} from 'rxjs';
import {FormsApi} from '../../../api/forms.api';
import {AuthApi} from '../../../api/auth.api';
import {ToastrService} from 'ngx-toastr';
import {tap} from 'rxjs/operators';
import {AuthStore} from '../../../services/auth.store';
import {LoadingService} from '../../../services/loading.service';
import {PageLoaderComponent} from '../../../components/page-loader/page-loader.component';
import {UserRegistrationRequestBody} from '../../../dto/auth/UserRegistrationRequestBody';
import {Subdivision} from '../../../dto/subdivision/Subdivision';
import {passwordShouldMatch} from '../../../forms/validators/password-should-match.validator';
import {ValidatorMessageContainer} from '../../../forms/error/input-error/validator-message-container.directive';
import {DynamicValidatorMessage} from '../../../forms/error/dynamic-validator-message.directive';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {StudentFormComponent} from './student-form/student-form.component';
import {TeacherFormComponent} from './teacher-form/teacher-form.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  providers: [
    LoadingService
  ],
  imports: [CommonModule, AuthComponent, LogoComponent, ReactiveFormsModule, ControlInjectorPipe, ButtonComponent, RouterLink, PageLoaderComponent, ValidatorMessageContainer, DynamicValidatorMessage, StudentFormComponent, TeacherFormComponent],
  template: `
    <app-auth>
      <div class="flex flex-col items-center">
        <app-logo></app-logo>
        <span class="self-stretch text-center text-gray-950 text-3xl font-normal font-kharkiv-tone leading-loose">
          Реєстрація
        </span>
      </div>
      <div class="flex flex-col gap-3 w-full">
        <form id="registrationForm"
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
              class="flex flex-col gap-2.5"
        >
          <div class="form-field">
            <label for="name">Повне Ім'я</label>
            <input
              formControlName="name"
              type="text"
              id="name"
              placeholder="Введіть своє ім'я"
            >
          </div>
          <div class="form-field">
            <label for="username">Логін</label>
            <input formControlName="username" type="text" id="username" placeholder="Введть свій логін">
          </div>
          <div class="form-field">
            <label for="email">Електронна пошта</label>
            <input formControlName="email" type="email" id="email" placeholder="Введіть свою електронну пошту">
          </div>
          <div class="form-field">
            <label for="birthDate">Дата народження</label>
            <input formControlName="birthDate" type="date" id="birthDate">
          </div>
          <div class="form-field">
            <label for="phoneNumber">Номер телефону</label>
            <input formControlName="phoneNumber" type="tel" id="phoneNumber" placeholder="Введіть свій номер телефону">
          </div>
          <div class="form-field">
            <label for="address">Адреса</label>
            <input formControlName="address" type="text" id="address" placeholder="Введіть свою адресу">
          </div>
          <div class="form-field">
            <label for="role">Роль</label>
            <select id="role" formControlName="role">
              <option *ngFor="let role of roles" [value]="role.value">{{role.label}}</option>
            </select>
          </div>

          <ng-container *ngIf="(roleSubject$ | async) === 'student'">
            <app-student-form></app-student-form>
          </ng-container>

          <ng-container *ngIf="(roleSubject$ | async) === 'teacher' && (subdivisions$ | async) as subdivisions">
            <app-teacher-form [subdivisions]="subdivisions"></app-teacher-form>
          </ng-container>

          <fieldset
            formGroupName="password"
            [errorContainer]="containerDir.container"
          >
            <legend>Пароль</legend>
            <div class="form-field">
              <label for="password">Пароль</label>
              <input formControlName="password" type="password" id="password" placeholder="Введіть пароль">
            </div>
            <div class="form-field">
              <label for="confirmPassword">Підтвердження паролю</label>
              <input withoutValidationErrors formControlName="confirmPassword" type="password" id="confirmPassword"
                     placeholder="Повторіть пароль">
              <ng-container validatorMessageContainer #containerDir="validatorMessageContainer"></ng-container>
            </div>
          </fieldset>
        </form>

        <span
          class="text-end text-gray-400 text-input-message font-normal font-inter leading-tight"
        >
          Вже маєте аккаунт? <a [routerLink]="['/login']" class="text-link hover:underline">Увійти.</a>
        </span>
        <app-button
          type="submit"
          form="registrationForm"
          classes="button--primary h-12 w-full"
        >
          <p class="text-title">Підтвердити</p>
        </app-button>
      </div>

      <app-page-loader></app-page-loader>
    </app-auth>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnInit {

  protected subdivisions$!: Observable<Subdivision[]>;

  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private formsApi = inject(FormsApi);
  private authApi = inject(AuthApi);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private loading = inject(LoadingService);
  private destroyRef = inject(DestroyRef);
  cd = inject(ChangeDetectorRef);

  roles: { label: string, value: string }[] = [
    {label: 'Студент', value: 'student'},
    {label: 'Викладач', value: 'teacher'},
  ];


  roleSubject$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  @ViewChild(FormGroupDirective)
  private formDir!: FormGroupDirective

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    username: ['',
      {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[\w.]+$/)
        ]
      }
    ],
    email: ['', [Validators.email, Validators.required]],
    birthDate: ['', [Validators.required]],
    address: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    role: this.fb.nonNullable.control(
      this.roles[this.roles.length - 1],
      Validators.required
    ),
    password: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ''
    }, {
      validators: passwordShouldMatch
    })
  });

  ngOnInit() {
    this.subdivisions$ = this.formsApi.getSubdivisions().pipe(
      catchError(err => {
        this.toastr.warning('Не вдалося отримати список підрозділів');
        return of([]);
      }),
    );

    this.form.controls['role'].valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((role: any) => {
      this.roleSubject$.next(role);
    });
    this.cd.markForCheck();
  }

  protected onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const registrationRequest = this.setRegistrationRequest(this.form);

    const register$ = this.authStore.register(registrationRequest).pipe(
      catchError(err => {
        switch (err.code) {
          case 1006: {
            this.toastr.warning('Користувач з таким ім`ям вже існує');
            this.formDir.form.get('login')?.reset();
            break;
          }
          default: {
            this.toastr.warning('Не вдалося зареєструвати. Спробуйте пізніше');
            break;
          }
        }
        return throwError(err);
      })
    );

    this.loading.showLoaderUntilCompleted(register$)
      .subscribe();
  }


  private setRegistrationRequest(form: FormGroup) {
    const registrationRequest: UserRegistrationRequestBody = {
      name: form.get('name')?.value,
      username: form.get('username')?.value,
      email: form.get('email')?.value,
      birthDate: form.get('birthDate')?.value,
      phoneNumber: form.get('phoneNumber')?.value,
      address: form.get('address')?.value,
      role: form.get('role')?.value,
      password: form.get('password')?.get('password')?.value,
      student: form.get('student')?.value,
      teacher: form.get('teacher')?.value,
    };
    return registrationRequest;
  }

}
