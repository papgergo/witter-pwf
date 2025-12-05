import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../shared/models/post';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../shared/models/user';
import { firstValueFrom, map, Observable } from 'rxjs';
import { PostService } from '../../shared/services/post.service';
import { AsyncPipe } from '@angular/common';
import { PostComponent } from '../home/post/post.component';
import { AuthFirestoreService } from '../../shared/services/auth-firestore.service';
import { ConversationService } from '../../shared/services/conversation.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule, MatButtonModule, MatIconModule, AsyncPipe, PostComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  public viewedUserData$!: Observable<User>;
  @Input({ required: true }) userId!: string;
  public postCollection$!: Observable<Post[]>;
  public loggedInUserData$!: Observable<User | null>;
  constructor(
    private postService: PostService,
    private authFirestoreService: AuthFirestoreService,
    private authService: AuthService,
    private conversationService: ConversationService,
    private router: Router
  ) {
    this.loggedInUserData$ = this.authService.getLoggedInUser();
  }

  ngOnInit(): void {
    this.postService.filterPostsByUser(this.userId);
    this.postCollection$ = this.postService.selectedPosts$;
    this.viewedUserData$ = this.authFirestoreService.getUser(this.userId);
  }
  ngOnDestroy(): void {
    this.postService.resetPostFilter();
  }

  public async createConversation(): Promise<void> {
    const loggedInUser = await firstValueFrom(this.loggedInUserData$);
    const viewedUser = await firstValueFrom(this.viewedUserData$);
    const conversationExists = await firstValueFrom(
      this.conversationService.checkIfConversationExists(loggedInUser!.id!, viewedUser.id!)
    );

    if (!conversationExists) {
      const newConversationId = await firstValueFrom(
        this.conversationService.createConversation(loggedInUser!.id!, viewedUser.id!)
      );
      this.router.navigate([`/messages/${newConversationId}`]);
    } else {
      this.router.navigate([`/messages/${conversationExists.id!}`]);
    }
  }
}
