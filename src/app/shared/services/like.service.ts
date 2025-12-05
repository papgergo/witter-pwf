import { Injectable } from '@angular/core';
import { LikeFirestoreService } from './like-firestore.service';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  constructor(private likeFireStoreService: LikeFirestoreService) {}

  public likePost(postId: string, userId: string): Observable<any> {
    return this.likeFireStoreService.checkLike(postId, userId);
  }

  public getUserLike(postId: string, userId: string): Observable<boolean> {
    return this.likeFireStoreService.getUserLike(postId, userId);
  }

  public getLikeCount(postId: string): Observable<number> {
    return this.likeFireStoreService.getLikeCount(postId).pipe(take(1));
  }
}
