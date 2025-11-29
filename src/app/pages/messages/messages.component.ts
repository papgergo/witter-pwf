import { Component } from '@angular/core';
import { Message } from '../../shared/models/message';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-messages',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {}
