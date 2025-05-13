import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('ngsw-worker.js')
    .then(reg => console.log('Service Worker zarejestrowany:', reg))
    .catch(err => console.error('Błąd SW:', err));
}
