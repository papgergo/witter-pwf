import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthFirestoreService } from '../../../shared/services/auth-firestore.service';
import { User } from '../../../shared/models/user';
import { Observable, map, switchMap, of, take } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../../../shared/services/post.service';
import { RouterLink } from '@angular/router';
import { LikeService } from '../../../shared/services/like.service';
import { UsernamePipe } from '../../../shared/pipe/username.pipe';
import { ManagementService } from '../../../shared/services/management.service';

@Component({
  selector: 'app-post',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    NgClass,
    UsernamePipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  @Input() public post?: Post;
  public poster$!: Observable<User>;
  public loggedInUser$: Observable<User | null>;
  public isOwner$!: Observable<boolean | undefined>;
  public isLiked$!: Observable<boolean>;
  constructor(
    private userFirestoreService: AuthFirestoreService,
    private likeService: LikeService,
    private authService: AuthService,
    private postService: PostService,
    private managementService: ManagementService
  ) {
    this.loggedInUser$ = this.authService.getLoggedInUser();
  }

  deletePost() {
    this.postService.openSnackBar('Post removed successfully!');
    this.managementService.deletePost(this.post?.id!);
  }

  ngOnInit(): void {
    if (!this.post) return;
    this.poster$ = this.userFirestoreService.getUser(this.post.userId);
    this.isOwner$ = this.loggedInUser$.pipe(map((user) => user?.id === this.post?.userId));
    this.isLiked$ = this.loggedInUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return of(false);
        }
        return this.likeService.getUserLike(this.post!.id!, user.id!);
      })
    );
  }

  likePost() {
    this.loggedInUser$
      .pipe(
        take(1),
        switchMap((user) => {
          this.postService.openSnackBar('Post liked successfully!');
          return this.likeService.likePost(this.post!.id!, user!.id!);
        })
      )
      .subscribe();
  }
}
