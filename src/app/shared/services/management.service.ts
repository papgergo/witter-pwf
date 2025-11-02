import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { User } from '../models/user';
import { Content } from '../models/content';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  private db!: IDBDatabase;
  private readonly objectStoreName = 'posts';
  public readonly posts: Post[] = [];

  constructor() {
    this.initIndexedDB();
  }

  /*
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
  */

  public createPost(poster: User, content: Content): boolean {
    const post: Post = {
      id: crypto.randomUUID(),
      poster: {
        id: 'asd1',
        email: 'asd1',
        username: '@pista',
        displayName: 'Pista',
        profilePictureUrl: 'asd',
        creationDate: Date.now(),
      },
      content: content,
    };
    const objectStore = this.db
      .transaction(this.objectStoreName, 'readwrite')
      .objectStore(this.objectStoreName);
    const request = objectStore.add(post);

    request.onsuccess = (event: any) => {
      this.posts.unshift(post);
    };

    request.onerror = (event: any) => {
      console.log('Error adding item:', event.target.error);
    };
    return true;
  }

  private initIndexedDB() {
    const request = indexedDB.open('posts-db', 1);

    request.onerror = (event: any) => {
      console.log('Detabase error:', event.target.error);
    };

    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;

      const objectStore = db.createObjectStore(this.objectStoreName, {
        keyPath: 'id',
      });

      objectStore.createIndex('content', 'content', { unique: false });
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      this.loadPosts();
    };
  }

  loadPosts(): void {
    const objectStore = this.db
      .transaction(this.objectStoreName)
      .objectStore(this.objectStoreName);
    objectStore.openCursor().onsuccess = (event: any) => {
      const cursor = event.target.result;

      if (cursor) {
        this.posts.push(cursor.value);

        cursor.continue();
      }
    };
  }
}
