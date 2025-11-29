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
  orderBy,
  query,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PostFireStoreService {
  private fireStore = inject(Firestore);
  private postCollection = 'Posts';

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

  public createPost(post: Post): Observable<any> {
    return from(addDoc(this.getCollectionRef(), post));
  }

  public removePost(postId: string): Observable<any> {
    return from(deleteDoc(doc(this.fireStore, this.postCollection, postId)));
  }

  private getCollectionRef(): CollectionReference {
    return collection(this.fireStore, this.postCollection);
  }
}
