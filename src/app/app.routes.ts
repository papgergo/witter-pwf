import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SearchComponent } from './pages/search/search.component';
import { authGuard, pubicGuard } from './shared/guard/auth.guard';
import { AuthFormComponent } from './pages/auth-form/auth-form.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'auth',
    component: AuthFormComponent,
    canActivate: [pubicGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
