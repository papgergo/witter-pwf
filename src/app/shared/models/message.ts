import { Content } from './content';
import { User } from './user';

export interface Message {
  id: string;
  senderUser: User;
  recieverUser: User;
  content: Content;
}
