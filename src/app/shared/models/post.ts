import { User } from './user';

export interface Post {
  id: string;
  userId: string;
  text?: string;
  attachmentUrlCollection?: string[];
  creationDate: Date;
}
