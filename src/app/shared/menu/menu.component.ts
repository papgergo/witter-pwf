import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [MatListModule, MatIconModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  @Input() sidenav!: MatSidenav;

  closeMenu() {
    this.sidenav.toggle();
  }
}
