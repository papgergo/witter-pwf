import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
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
import { UsernamePipe } from '../../shared/pipe/username.pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-profile',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    PostComponent,
    UsernamePipe,
    ReactiveFormsModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  public viewedUserData$!: Observable<User>;
  @Input({ required: true }) userId!: string;
  public postCollection$!: Observable<Post[]>;
  public loggedInUserData$!: Observable<User | null>;
  public usernameForm!: FormGroup;

  constructor(
    private postService: PostService,
    private authFirestoreService: AuthFirestoreService,
    private authService: AuthService,
    private conversationService: ConversationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loggedInUserData$ = this.authService.getLoggedInUser();
  }

  ngOnInit(): void {
    this.postService.filterPostsByUser(this.userId);
    this.postCollection$ = this.postService.selectedPosts$;
    this.viewedUserData$ = this.authFirestoreService.getUser(this.userId);
    this.usernameForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
    });
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

  public async changeUsername(): Promise<void> {
    if (this.usernameForm.invalid) {
      return;
    }

    const loggedInUser = await firstValueFrom(this.loggedInUserData$);
    if (!loggedInUser) {
      console.error('User not logged in');
      return;
    }

    const newUsername = this.usernameForm.get('username')?.value;
    await this.authService.updateUsername(loggedInUser.id!, newUsername);
  }
}
