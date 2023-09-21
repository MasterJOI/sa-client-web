import { InjectionToken } from "@angular/core"

export const ERROR_MESSAGES: { [key: string]: (args?: any) => string} = {
  required: () => `Це обов'язкове поле`,
  requiredTrue: () => `Це обов'язкове поле`,
  email: () => `Це має бути дійсна електронна адреса`,
  minlength: ({requiredLength}) => `Довжина має бути принаймні ${requiredLength} символи(-ів)`,
  appPasswordShouldMatch: () => `Паролі мають співпадати`,
  passwordShouldMatch: () => `Паролі мають співпадати`,
  pattern: () => `Неправильний формат`,
  appUniqueUsername: () => `Цей логін вже використовується`,
  uniqueUsername: () => `Цей логін вже використовується`,
}

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(`Validation Messages`, {
  providedIn: 'root',
  factory: () => ERROR_MESSAGES
})
