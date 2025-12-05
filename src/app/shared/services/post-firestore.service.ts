import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Post } from '../models/post';
import {
  addDoc,
  collection,
  CollectionReference,
  collectionSnapshots,
  deleteDoc,
  doc,
  Firestore,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PostFireStoreService {
  private fireStore = inject(Firestore);
  private postCollection = 'Posts';
  private replisCollection = 'Replies';

  public getPosts(): Observable<Post[]> {
    const q = query(this.getCollectionRef(), orderBy('creationDate', 'desc'));
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

  public getPostsByUserId(userId: string): Observable<Post[]> {
    const q = query(
      this.getCollectionRef(),
      orderBy('creationDate', 'desc'),
      where('userId', '==', userId)
    );
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

  public createPost(post: Post): Observable<any> {
    return from(addDoc(this.getCollectionRef(), post));
  }

  public removePost(postId: string): Observable<any> {
    return from(deleteDoc(doc(this.getCollectionRef(), postId)));
  }

  public incrementLikeCount(postId: string): Observable<void> {
    const docRef = doc(this.getCollectionRef(), postId);
    return from(updateDoc(docRef, { likeCount: increment(1) }));
  }

  public decrementLikeCount(postId: string): Observable<void> {
    const docRef = doc(this.getCollectionRef(), postId);
    return from(updateDoc(docRef, { likeCount: increment(-1) }));
  }

  private getCollectionRef(): CollectionReference {
    return collection(this.fireStore, this.postCollection);
  }
}
