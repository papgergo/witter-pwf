import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButton,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public registerForm: FormGroup;
  errorMessage = signal('');
  constructor(
    formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  register() {
    const email = this.registerForm.value.email;
    const username = this.registerForm.value.username;
    const password = this.registerForm.value.password;
    const confirmPassword = this.registerForm.value.confirmPassword;

    const userData: Partial<User> = {
      username: username,
      displayName: username,
      profilePictureUrl: 'img/default_profile_picture.png',
      creationDate: new Date(),
    };

    this.authService
      .register(email, password, confirmPassword, userData)
      .then(() => {
        this.authService.openSnackBar('Account created Successfully');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.authService.openSnackBar('This email already in use');
            break;
          case 'auth/invalid-email':
            this.authService.openSnackBar('Invalid email');
            break;
          case 'auth/weak-password':
            this.authService.openSnackBar(
              'The password is too weak. Use at least 6 characters.'
            );
            break;
          default:
            this.authService.openSnackBar(
              'An error has occurred during registration. Please try again later.'
            );
        }
      });
  }
}
