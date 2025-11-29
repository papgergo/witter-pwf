import { Component } from '@angular/core';
import { Post } from '../../shared/models/post';
import { PostComponent } from './post/post.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostService } from '../../shared/services/post.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [PostComponent, PostFormComponent, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public postCollection$: Observable<Post[]>;
  constructor(private postService: PostService) {
    this.postCollection$ = this.postService.selectedPosts$;
  }
}
