import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Post } from '../models/post';
import { PostFireStoreService } from './post-firestore.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts$: Observable<Post[]>;

  public selectedPosts$: Observable<Post[]>;

  constructor(private postFireStoreService: PostFireStoreService) {
    this.posts$ = this.postFireStoreService.getPosts();

    this.selectedPosts$ = this.posts$;
  }

  public createPost(post: Post): void {
    this.postFireStoreService.createPost(post).pipe(take(1)).subscribe();
  }

  public removePost(postId: string): void {
    this.postFireStoreService.removePost(postId).pipe(take(1)).subscribe();
  }
}
