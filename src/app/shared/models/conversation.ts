import { Observable } from 'rxjs';
import { Message } from './message';
import { User } from './user';

export interface ConversationWithUserData extends Conversation {
  otherUser$: Observable<User>;
}

export interface Conversation {
  id?: string;
  userOneId: string;
  userTwoId: string;
  messages: Message[];
}
