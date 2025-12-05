import { Routes } from '@angular/router';
import { authGuard, pubicGuard } from './shared/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then((c) => c.SearchComponent),
  },
  {
    path: 'post/:postId',
    loadComponent: () =>
      import('./pages/home/post-page/post-page.component').then((c) => c.PostPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'messages/:convId',
    loadComponent: () =>
      import('./pages/conversations/conversation/conversation.component').then(
        (c) => c.ConversationComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'messages',
    loadComponent: () =>
      import('./pages/conversations/conversations.component').then((c) => c.ConversationsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile/:userId',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((c) => c.ProfileComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then((c) => c.SettingsComponent),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth-form/auth-form.component').then((c) => c.AuthFormComponent),
    canActivate: [pubicGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
