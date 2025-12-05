import { Injectable } from '@angular/core';
import { ReplyFirestoreService } from './reply-firestore.service';
import { Post } from '../models/post';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  public replies$?: Observable<Post[]>;
  constructor(private replyFireStoreService: ReplyFirestoreService) {}

  public createReply(postId: string, newPost: Post) {
    this.replyFireStoreService.createReply(postId, newPost);
  }

  public getReplies(postId: string): Observable<Post[]> {
    return this.replyFireStoreService.getReplies(postId).pipe(shareReplay(1));
  }
}
