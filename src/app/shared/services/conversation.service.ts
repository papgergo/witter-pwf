import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { Conversation, ConversationWithUserData } from '../models/conversation';
import { AuthService } from './auth.service';
import { ConversationFirestoreService } from './conversation-firestore.service';
import { AuthFirestoreService } from './auth-firestore.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private conversations$: Observable<ConversationWithUserData[]>;
  public selectedConversations$: Observable<ConversationWithUserData[]>;
  constructor(
    private authService: AuthService,
    private authFirestoreService: AuthFirestoreService,
    private conversationFirestoreService: ConversationFirestoreService
  ) {
    this.conversations$ = this.authService.getLoggedInFireUser().pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }
        return this.conversationFirestoreService.getConversationsByUserId(user.uid).pipe(
          map((conversations) =>
            conversations.map((convo) => {
              const otherUserId = convo.userOneId === user.uid ? convo.userTwoId : convo.userOneId;
              return {
                ...convo,
                otherUser$: this.authFirestoreService.getUser(otherUserId),
              };
            })
          )
        );
      })
    );

    this.selectedConversations$ = this.conversations$;
  }

  public getConversationById(convId: string): Observable<ConversationWithUserData | undefined> {
    return this.selectedConversations$.pipe(
      map((convos) => convos.find((c) => c.id === convId)),
      take(1)
    );
  }

  public checkIfConversationExists(
    userOneId: string,
    userTwoId: string
  ): Observable<ConversationWithUserData | undefined> {
    return this.selectedConversations$.pipe(
      map((convos) =>
        convos.find(
          (c) =>
            (c.userOneId === userOneId && c.userTwoId === userTwoId) ||
            (c.userOneId === userTwoId && c.userTwoId === userOneId)
        )
      )
    );
  }

  public createConversation(userOneId: string, userTwoId: string): Observable<string> {
    return this.conversationFirestoreService.createConversation(userOneId, userTwoId).pipe(take(1));
  }
}
