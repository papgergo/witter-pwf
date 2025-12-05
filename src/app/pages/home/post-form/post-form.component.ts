import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Post } from '../../../shared/models/post';
import { PostService } from '../../../shared/services/post.service';
import { firstValueFrom } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReplyService } from '../../../shared/services/reply.service';

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
  @Input() postId?: string;
  public postForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private authService: AuthService,
    private postService: PostService,
    private replyService: ReplyService
  ) {
    this.postForm = formBuilder.group({
      text: ['', Validators.required],
    });
  }

  async onSubmit() {
    const fireUser = await firstValueFrom(this.authService.user$);
    if (!fireUser) {
      return;
    }
    const date = new Date();
    const todayDate = `${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;

    const newPost: Post = {
      userId: fireUser.uid,
      text: this.postForm.value.text,
      creationDate: todayDate,
      likeCount: 0,
    };
    if (this.postId) {
      this.replyService.createReply(this.postId, newPost);
    } else {
      this.postService.createPost(newPost);
    }
    this.postForm.reset({ text: '' }, { emitEvent: false });
  }
}
