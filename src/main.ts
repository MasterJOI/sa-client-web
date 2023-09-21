import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

export function tokenGetter() {
    return localStorage.getItem("access_token");
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
