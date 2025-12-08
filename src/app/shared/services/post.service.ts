import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay, switchMap, take } from 'rxjs';
import { Post } from '../models/post';
import { PostFireStoreService } from './post-firestore.service';
import { ManagementService } from './management.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private _snackBar = inject(MatSnackBar);
  private posts$: Observable<Post[]>;

  public selectedPosts$: Observable<Post[]>;

  constructor(private postFireStoreService: PostFireStoreService) {
    this.posts$ = this.postFireStoreService.getPosts().pipe(shareReplay(1));

    this.selectedPosts$ = this.posts$;
  }

  public createPost(post: Post): void {
    this.postFireStoreService.createPost(post).pipe(take(1)).subscribe();
  }

  public removePost(postId: string): void {
    this.postFireStoreService.removePost(postId).pipe(take(1)).subscribe();
  }

  public filterPostsByUser(userId: string): void {
    this.selectedPosts$ = this.posts$.pipe(
      map((posts) => posts.filter((post) => post.userId === userId))
    );
  }

  public resetPostFilter(): void {
    this.selectedPosts$ = this.posts$;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
