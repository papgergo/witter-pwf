import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu',
  imports: [MatListModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false;

  private authSubscription!: Subscription;

  @Input() sidenav!: MatSidenav;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.user$.subscribe((user) => {
      this.isUserLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
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
