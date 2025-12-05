import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  collectionSnapshots,
  Firestore,
  orderBy,
  query,
  collectionGroup,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageFirestoreService {
  private firestore = inject(Firestore);
  private readonly messageCollection = 'Messages';
  private readonly conversationCollection = 'Conversation';
  constructor() {}

  public getMessages(convId: string): Observable<Message[]> {
    const q = query(this.getCollectionRef(convId));

    return collectionSnapshots(q).pipe(
      map((docSnapshots) =>
        docSnapshots.map(
          (snapshot) => ({ ...snapshot.data(), id: snapshot.id } as Message)
        )
      )
    );
  }

  public sendMessage(convId: string, message: Message): Observable<any> {
    return from(addDoc(this.getCollectionRef(convId), message));
  }

  private getCollectionRef(convId: string): CollectionReference {
    return collection(
      this.firestore,
      this.conversationCollection + '/' + convId + '/' + this.messageCollection
    );
  }
}
