import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  initializeFirestore,
  persistentLocalCache,
  provideFirestore,
} from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyCHWctetvnSpQlujfYYm06tMrI6E0pINfA',
        authDomain: 'witter-pwf.firebaseapp.com',
        projectId: 'witter-pwf',
        storageBucket: 'witter-pwf.firebasestorage.app',
        messagingSenderId: '466879745060',
        appId: '1:466879745060:web:672282001f3217d56e9cb1',
      })
    ),
    provideFirestore(() =>
      initializeFirestore(getApp(), {
        localCache: persistentLocalCache(),
      })
    ),
    provideAuth(() => getAuth()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
};
