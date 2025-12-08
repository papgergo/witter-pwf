import { Component, inject, OnInit } from '@angular/core';
import { ConversationService } from '../../shared/services/conversation.service';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConversationWithUserData } from '../../shared/models/conversation';
import { UsernamePipe } from '../../shared/pipe/username.pipe';

@Component({
  selector: 'app-conversations',
  imports: [MatCardModule, MatIconModule, AsyncPipe, RouterLink, UsernamePipe],
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss'],
})
export class ConversationsComponent {
  public conversations$: Observable<ConversationWithUserData[]>;
  constructor(private conversationService: ConversationService) {
    this.conversations$ = this.conversationService.selectedConversations$;
  }
}
