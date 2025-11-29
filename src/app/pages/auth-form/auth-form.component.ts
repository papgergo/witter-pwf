import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-auth-form',
  imports: [MatCardModule, LoginComponent, RegisterComponent, MatButton],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
  public authType: 'Login' | 'Register' = 'Login';

  toggleAuthType(): void {
    this.authType = this.authType === 'Login' ? 'Register' : 'Login';
  }
}
