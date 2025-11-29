import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm: FormGroup;
  errorMessage = signal('');
  constructor(
    formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService
      .signIn(email, password)
      .then(() => {
        this.authService.openSnackBar('Logged in successfully');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/user-not-found':
            this.authService.openSnackBar('No user found');
            break;
          case 'auth/wrong-password':
            this.authService.openSnackBar('Incorrect password');
            break;
          case 'auth/invalid-credential':
            this.authService.openSnackBar('Invalid email or password');
            break;
          default:
            this.authService.openSnackBar('Error occoured. Please try again');
        }
      });
  }
}
