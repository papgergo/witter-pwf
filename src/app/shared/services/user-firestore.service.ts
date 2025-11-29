import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  docData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserFirestoreService {
  private firestore = inject(Firestore);
  private readonly usersCollection = 'Users';

  public getUser(userId: string): Observable<User> {
    return docData(doc(this.getCollectionRef(), userId)) as Observable<User>;
  }

  public createUser(userId: string, userData: Partial<User>): Observable<any> {
    return from(addDoc(this.getCollectionRef(), userData));
  }

  private getCollectionRef(): CollectionReference {
    return collection(this.firestore, this.usersCollection);
  }
}
