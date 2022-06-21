import { IPost } from '../../posts/utils/models/post.interface';
import { IUser } from '../../user/utils/models/user.interface';

export interface IComment {
  id?: number;
  user: IUser;
  post: IPost;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
