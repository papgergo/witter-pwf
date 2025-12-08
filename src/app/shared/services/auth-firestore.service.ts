import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthFirestoreService {
  private firestore = inject(Firestore);
  private readonly usersCollection = 'Users';

  public getUser(userId: string): Observable<User> {
    return docData(doc(this.getCollectionRef(), userId), {
      idField: 'id',
    }) as Observable<User>;
  }

  public updateUsername(userId: string, newUsername: string): Observable<any> {
    return from(
      updateDoc(doc(this.firestore, this.usersCollection, userId), {
        displayName: newUsername,
      })
    );
  }
  private getCollectionRef(): CollectionReference {
    return collection(this.firestore, this.usersCollection);
  }
}
