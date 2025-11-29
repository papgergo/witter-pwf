import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'witter';
  private swUpdate = inject(SwUpdate);
  private onlineCallback = () => console.log('online');
  private offlineCallback = () => console.log('offline');

  ngOnInit(): void {
    /*
    interval(3000).subscribe(() => {
      this.swUpdate.checkForUpdate().then((update) => {
        if (update) {
          alert('new changes');

          window.location.reload();
        }
      });
    });
    */
    window.addEventListener('online', this.onlineCallback);

    window.addEventListener('offline', this.offlineCallback);
  }

  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this.onlineCallback);

    window.removeEventListener('offline', this.offlineCallback);
  }
}
