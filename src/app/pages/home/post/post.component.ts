import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserFirestoreService } from '../../../shared/services/user-firestore.service';
import { User } from '../../../shared/models/user';
import { Observable, map, switchMap, of } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../../../shared/services/post.service';

@Component({
  selector: 'app-post',
  imports: [MatCardModule, MatButtonModule, MatIconModule, AsyncPipe, NgIf],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  @Input({ required: true }) public post?: Post;
  public poster$!: Observable<User>;
  public isOwner$!: Observable<boolean>;

  constructor(
    private userFirestoreService: UserFirestoreService,
    private authService: AuthService,
    private postService: PostService
  ) {}

  deletePost() {
    this.postService.removePost(this.post?.id!);
  }

  ngOnInit(): void {
    if (this.post?.userId) {
      // Re-create poster observable whenever auth state changes
      this.poster$ = this.authService.user$.pipe(
        switchMap(() => this.userFirestoreService.getUser(this.post!.userId))
      );

      this.isOwner$ = this.authService.user$.pipe(
        map((loggedInUser) => loggedInUser?.uid === this.post?.userId)
      );
    }
  }
}
