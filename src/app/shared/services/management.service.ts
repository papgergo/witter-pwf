import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { PostService } from './post.service';
import { PostFireStoreService } from './post-firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  private db!: IDBDatabase;
  private readonly objectStoreName = 'posts';
  private readonly posts: Post[] = [];
  private readonly postsChange$ = new BehaviorSubject(this.posts);

  constructor(
    private postFireStoreService: PostFireStoreService,
    private postService: PostService
  ) {
    this.initIndexedDB();
  }

  private initIndexedDB() {
    const request = indexedDB.open('posts-db', 1);

    request.onerror = (event: any) => {
      console.log('Detabase error:', event.target.error);
    };

    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;
      if (!db.objectStoreNames.contains(this.objectStoreName)) {
        db.createObjectStore(this.objectStoreName, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      this.loadPosts();
    };
  }

  loadPosts(): void {
    const objectStore = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName);
    objectStore.openCursor().onsuccess = (event: any) => {
      const cursor = event.target.result;

      if (cursor) {
        this.posts.push(cursor.value);

        cursor.continue();
      } else {
        this.syncPostsWithFirestore();
      }
    };
  }

  private async syncPostsWithFirestore(): Promise<void> {
    if (this.posts.length == 0) {
      const firestorePosts = await firstValueFrom(this.postFireStoreService.getPosts());
      const objectStore = this.db
        .transaction(this.objectStoreName, 'readwrite')
        .objectStore(this.objectStoreName);

      firestorePosts.forEach((post) => {
        if (post.id) {
          objectStore.add(post);
          this.posts.push(post);
        }
      });
    }
    this.syncPosts();
  }

  public async createPost(post: Post): Promise<boolean> {
    const docRef = await firstValueFrom(this.postFireStoreService.createPost(post));
    const newPost: Post = { ...post, id: docRef };

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
        this.postService.removePost(postId);
        this.syncPosts();
      }
    };
  }

  public get posts$(): Observable<Post[]> {
    return this.postsChange$.asObservable();
  }

  private syncPosts(): void {
    this.postsChange$.next([...this.posts]);
  }
}
