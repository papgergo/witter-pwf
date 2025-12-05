import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Observable, switchMap } from 'rxjs';
import { User } from '../../../shared/models/user';
import { PostComponent } from '../post/post.component';
import { AsyncPipe } from '@angular/common';
import { PostFormComponent } from '../post-form/post-form.component';
import { ReplyService } from '../../../shared/services/reply.service';

@Component({
  selector: 'app-post-page',
  imports: [PostComponent, AsyncPipe, PostFormComponent],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
})
export class PostPageComponent implements OnInit {
  @Input() postId!: string;
  public isLoggedIn$!: Observable<User | null>;
  public post$!: Observable<Post>;
  public replies$!: Observable<Post[]>;
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private replyService: ReplyService
  ) {
    this.isLoggedIn$ = this.authService.getLoggedInUser();
  }

  ngOnInit(): void {
    this.post$ = this.postService.selectedPosts$.pipe(
      switchMap((posts) => {
        return posts.filter((p) => p.id === this.postId);
      })
    );
    this.replies$ = this.replyService.getReplies(this.postId);
  }
}
