import { Component } from '@angular/core';
import { Message } from '../../shared/models/message';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-messages',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  private post: Message = {
    id: '0',
    senderUser: {
      id: 'asd1',
      email: 'asd1',
      username: '@pista',
      displayName: 'Pista',
      profilePictureUrl: 'asd',
      creationDate: Date.now(),
    },
    recieverUser: {
      id: 'asd2',
      email: 'asd2',
      username: '@joska',
      displayName: 'Joska',
      profilePictureUrl: 'asd',
      creationDate: Date.now(),
    },
    content: {
      text: 'Szia!',
      attachmentCollection: [
        {
          fileUrl:
            'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGl0dGxlJTIwY2F0fGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
          id: 'asd',
        },
      ],
    },
  };
  public messageCollection: Message[] = [this.post, this.post, this.post];
}
