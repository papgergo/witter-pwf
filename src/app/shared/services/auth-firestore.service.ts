import { inject, Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  docData,
  Firestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
  private getCollectionRef(): CollectionReference {
    return collection(this.firestore, this.usersCollection);
  }
}
