import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { MessageFirestoreService } from './message-firestore.service';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private convId$ = new BehaviorSubject<string | null>(null);
  private messages$: Observable<Message[]>;

  public selectedMessages$: Observable<Message[]>;
  constructor(private messageFirestoreService: MessageFirestoreService) {
    this.messages$ = this.convId$.pipe(
      switchMap((convId) => {
        if (!convId) {
          return [];
        }
        return this.messageFirestoreService.getMessages(convId);
      }),
      shareReplay(1)
    );
    this.selectedMessages$ = this.messages$;
  }

  public getMessages(convId: string): void {
    this.convId$.next(convId);
  }

  public sendMessage(convId: string, message: Message): void {
    this.messageFirestoreService
      .sendMessage(convId, message)
      .pipe(take(1))
      .subscribe();
  }
}
