import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ManagementService } from '../../../shared/services/management.service';
import { isThisTypeNode } from 'typescript';

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
    formBuilder: FormBuilder,
    private managementService: ManagementService
  ) {
    this.postForm = formBuilder.group({
      text: [''],
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.managementService.createPost(
        {
          id: crypto.randomUUID(),
          email: 'asd1',
          username: '@pista',
          displayName: 'Pista',
          profilePictureUrl: 'asd',
          creationDate: Date.now(),
        },
        { text: this.postForm.value.text }
      );
      this.postForm.reset(this.postForm.value.text);
    }
  }
}
