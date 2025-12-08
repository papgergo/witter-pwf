import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, map, Observable, Subscription, switchMap, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../models/user';

@Component({
  selector: 'app-menu',
  imports: [MatListModule, MatIconModule, RouterLink, CommonModule, MatSidenavModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  public loggedInUser$!: Observable<User | null>;

  @Input() sidenav!: MatSidenav;
  constructor(private authService: AuthService, private router: Router) {
    this.loggedInUser$ = this.authService.getLoggedInUser();
  }

  closeMenu() {
    this.sidenav.toggle();
  }

  async logOut() {
    await this.authService.logout();
    this.authService.openSnackBar('Logged out successfully');
    this.router.navigate(['/home']);
  }
}
