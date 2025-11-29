import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  private db!: IDBDatabase;
  private readonly objectStoreName = 'posts';
  private readonly posts: Post[] = [];
  private readonly postsChange$ = new BehaviorSubject(this.posts);

  constructor() {
    this.initIndexedDB();
  }

  public createPost(post: Post): boolean {
    const newPost: Post = post;
    const objectStore = this.db
      .transaction(this.objectStoreName, 'readwrite')
      .objectStore(this.objectStoreName);
    const request = objectStore.add(newPost);

    request.onsuccess = (event: any) => {
      this.posts.unshift(newPost);
      this.syncPosts();
    };

    request.onerror = (event: any) => {
      console.log('Error adding item:', event.target.error);
    };
    return true;
  }

  public deletePost(postId: string): void {
    const objectStore = this.db
      .transaction(this.objectStoreName, 'readwrite')
      .objectStore(this.objectStoreName);
    const request = objectStore.delete(postId);

    request.onsuccess = () => {
      const index = this.posts.findIndex((p) => p.id === postId);
      if (index !== -1) {
        this.posts.splice(index, 1);
        this.syncPosts();
      }
    };
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
      } else {
        this.syncPosts();
      }
    };
  }

  public get posts$(): Observable<Post[]> {
    return this.postsChange$.asObservable();
  }

  private syncPosts(): void {
    //TODO
    //this.postsChange$.next([...this.posts]);
  }
}
