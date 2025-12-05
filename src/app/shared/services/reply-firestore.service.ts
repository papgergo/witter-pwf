import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionSnapshots,
  CollectionReference,
  Firestore,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Post } from '../models/post';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReplyFirestoreService {
  private fireStore = inject(Firestore);
  private repliesCollection = 'Replies';
  private postCollection = 'Posts';
  constructor() {}

  public createReply(postId: string, reply: Post) {
    return from(addDoc(this.getCollectionRef(postId), reply));
  }

  public getReplies(postId: string): Observable<Post[]> {
    const q = query(this.getCollectionRef(postId));
    return collectionSnapshots(q).pipe(
      map((docSnapshots) =>
        docSnapshots.map(
          (snapshot) =>
            ({
              ...snapshot.data(),
              id: snapshot.id,
            } as Post)
        )
      )
    );
  }

  private getCollectionRef(postId: string): CollectionReference {
    return collection(
      this.fireStore,
      this.postCollection + '/' + postId + '/' + this.repliesCollection
    );
  }
}
