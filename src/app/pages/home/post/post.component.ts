import { Component, Input } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @Input() public post?: Post;
}
