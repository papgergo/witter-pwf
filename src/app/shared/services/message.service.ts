import { inject, Injectable } from '@angular/core';
import { Message } from '../models/message';
import { MessageFirestoreService } from './message-firestore.service';
import { BehaviorSubject, Observable, shareReplay, switchMap, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private _snackBar = inject(MatSnackBar);
  private convId$ = new BehaviorSubject<string | null>(null);
  private messages$: Observable<Message[]>;

  public selectedMessages$: Observable<Message[]>;
  constructor(private messageFirestoreService: MessageFirestoreService) {
    this.messages$ = this.convId$.pipe(
      switchMap((convId) => {
        return this.messageFirestoreService.getMessages(convId!);
      }),
      shareReplay(1)
    );
    this.selectedMessages$ = this.messages$;
  }

  public getMessages(convId: string): void {
    this.convId$.next(convId);
  }

  public sendMessage(convId: string, message: Message): void {
    this.messageFirestoreService.sendMessage(convId, message).pipe(take(1)).subscribe();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
