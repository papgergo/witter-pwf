import { Component, Input } from '@angular/core';
import { BehaviorSubject, filter, firstValueFrom, Observable, switchMap, take } from 'rxjs';
import { Message } from '../../../shared/models/message';
import { MessageService } from '../../../shared/services/message.service';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, NgClass } from '@angular/common';
import { User } from '../../../shared/models/user';
import { ConversationService } from '../../../shared/services/conversation.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatFormField, MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { UsernamePipe } from '../../../shared/pipe/username.pipe';

@Component({
  selector: 'app-conversation',
  imports: [
    MatCardModule,
    AsyncPipe,
    MatIcon,
    RouterLink,
    NgClass,
    MatFormField,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    UsernamePipe,
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss',
})
export class ConversationComponent {
  public messageForm: FormGroup;

  private convIdSubject$ = new BehaviorSubject<string | null>(null);
  @Input()
  public set convId(id: string | undefined) {
    if (id) {
      this.convIdSubject$.next(id);
      this.messageService.getMessages(id);
    }
  }
  public otherUserData$!: Observable<User>;
  public loggedInUserData$!: Observable<User | null>;

  public readonly messages$: Observable<Message[]>;
  constructor(
    formBuilder: FormBuilder,
    private messageService: MessageService,
    private conversationService: ConversationService,
    private authService: AuthService
  ) {
    this.messages$ = this.messageService.selectedMessages$;

    this.otherUserData$ = this.convIdSubject$.pipe(
      switchMap((id) => this.conversationService.getConversationById(id!)),
      switchMap((convo) => convo!.otherUser$)
    );
    this.loggedInUserData$ = this.authService.getLoggedInUser();

    this.messageForm = formBuilder.group({
      text: ['', Validators.required],
    });
  }

  async onSubmit() {
    const convId = this.convIdSubject$.value;
    const loggedInUser = await firstValueFrom(this.loggedInUserData$);
    const otherUser = await firstValueFrom(this.otherUserData$);
    const date = new Date();

    const message: Message = {
      senderUser: loggedInUser!.id!,
      recieverUser: otherUser!.id!,
      text: this.messageForm.value.text,
      timestamp: date.toISOString(),
    };
    this.messageService.openSnackBar('Message sent successfully!');
    this.messageService.sendMessage(convId!, message);
    this.messageForm.reset({ text: '' }, { emitEvent: false });
  }
}
