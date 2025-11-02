import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Post } from '../../shared/models/post';
import { PostComponent } from './post/post.component';
import { PostFormComponent } from './post-form/post-form.component';
import { ManagementService } from '../../shared/services/management.service';

@Component({
  selector: 'app-home',
  imports: [PostComponent, PostFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public postCollection: Post[];

  constructor(private managementService: ManagementService) {
    this.postCollection = managementService.posts;
  }
}
