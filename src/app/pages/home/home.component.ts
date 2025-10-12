import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Post } from '../../shared/models/post';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private post: Post = {
    id: '0',
    poster: {
      id: 'asd1',
      email: 'asd',
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
