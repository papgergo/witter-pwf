import { inject, Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  Firestore,
  getCountFromServer,
  setDoc,
  query,
  where,
  deleteDoc,
  docData,
} from '@angular/fire/firestore';
import { from, map, Observable, switchMap, take, forkJoin } from 'rxjs';
import { PostFireStoreService } from './post-firestore.service';

@Injectable({
  providedIn: 'root',
})
export class LikeFirestoreService {
  private fireStore = inject(Firestore);
  private postFirestoreService = inject(PostFireStoreService);
  private likeCollection = 'Like';

  public checkLike(postId: string, userId: string): Observable<any> {
    return this.getUserLike(postId, userId).pipe(
      take(1),
      switchMap((like) => {
        if (like) {
          return this.removeLike(postId, userId);
        } else {
          return this.likePost(postId, userId);
        }
      })
    );
  }

  public likePost(postId: string, userId: string): Observable<any> {
    const likeId = `${userId}_${postId}`;
    const docRef = doc(this.getCollectionRef(), likeId);
    const like$ = from(setDoc(docRef, { userId, postId }));
    const increment$ = this.postFirestoreService.incrementLikeCount(postId);

    return forkJoin([like$, increment$]);
  }

  public removeLike(postId: string, userId: string): Observable<any> {
    const likeId = `${userId}_${postId}`;
    const removeLike$ = from(deleteDoc(doc(this.getCollectionRef(), likeId)));
    const decrement$ = this.postFirestoreService.decrementLikeCount(postId);

    return forkJoin([removeLike$, decrement$]);
  }

  public getUserLike(postId: string, userId: string): Observable<any> {
    const likeId = `${userId}_${postId}`;
    return docData(doc(this.getCollectionRef(), likeId));
  }

  public getLikeCount(postId: string): Observable<number> {
    const q = query(this.getCollectionRef(), where('postId', '==', postId));
    return from(getCountFromServer(q)).pipe(map((snapshot) => snapshot.data().count));
  }

  private getCollectionRef(): CollectionReference {
    return collection(this.fireStore, this.likeCollection);
  }
}
