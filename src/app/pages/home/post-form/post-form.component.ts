import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Post } from '../../../shared/models/post';
import { PostService } from '../../../shared/services/post.service';
import { firstValueFrom } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserFirestoreService } from '../../../shared/services/user-firestore.service';

@Component({
  selector: 'app-post-form',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
})
export class PostFormComponent {
  public postForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private postService: PostService,
    private userFireStoreService: UserFirestoreService
  ) {
    this.postForm = formBuilder.group({
      text: [''],
    });
  }

  async onSubmit() {
    const fireUser = await firstValueFrom(this.authService.user$);
    if (!fireUser) {
      console.error('User not logged in, cannot create post.');
      return;
    }

    const newPost: Post = {
      id: crypto.randomUUID(),
      userId: fireUser.uid,
      text: this.postForm.value.text,
      creationDate: new Date(),
    };
    this.postService.createPost(newPost);
    this.postForm.reset({ text: '' }, { emitEvent: false });
  }
}
