import { Content } from './content';
import { User } from './user';

export interface Post {
  id: string;
  poster: User;
  content: Content;
}
