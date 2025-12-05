import { inject, Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  Firestore,
  query,
  where,
  collectionSnapshots,
  orderBy,
  or,
  addDoc,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Conversation } from '../models/conversation';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class ConversationFirestoreService {
  private firestore = inject(Firestore);
  private readonly conversationCollection = 'Conversation';

  public getConversationsByUserId(userId: string): Observable<Conversation[]> {
    const q = query(
      this.getCollectionRef(),
      or(where('userOneId', '==', userId), where('userTwoId', '==', userId))
    );
    return collectionSnapshots(q).pipe(
      map((docSnapshots) =>
        docSnapshots.map(
          (snapshot) =>
            ({
              ...snapshot.data(),
              id: snapshot.id,
            } as Conversation)
        )
      )
    );
  }

  public createConversation(userOneId: string, userTwoId: string): Observable<string> {
    const newConversation: Partial<Conversation> = {
      userOneId: userOneId,
      userTwoId: userTwoId,
    };

    return from(addDoc(this.getCollectionRef(), newConversation)).pipe(map((docRef) => docRef.id));
  }

  private getCollectionRef(): CollectionReference {
    return collection(this.firestore, this.conversationCollection);
  }
}
