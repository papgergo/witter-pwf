import { Component } from '@angular/core';
import { Post } from '../../shared/models/post';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  currentUser: User = {
    id: 'asd1',
    email: 'asd1',
    username: '@pista',
    displayName: 'Pista',
    profilePictureUrl: 'asd',
    creationDate: Date.now(),
  };

  private post: Post = {
    id: '0',
    poster: {
      id: 'asd1',
      email: 'asd1',
      username: '@pista',
      displayName: 'Pista',
      profilePictureUrl: 'asd',
      creationDate: Date.now(),
    },
    content: {
      text: 'Sziasztok!',
      attachmentCollection: [
        {
          fileUrl:
            'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGl0dGxlJTIwY2F0fGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
          id: 'asd',
        },
      ],
    },
  };
  public postCollection: Post[] = [this.post, this.post, this.post];
}
