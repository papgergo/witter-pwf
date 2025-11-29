import { User } from './user';

export interface Message {
  id: string;
  senderUser: User;
  recieverUser: User;
  text?: string;
  attachmentUrlCollection?: string[];
}
