import { IPost } from 'src/posts/utils/models/post.interface';
import { IUser } from 'src/user/utils/models/user.interface';
import { LikeType } from './like.entity';

export interface ILike {
  id: number;
  type: LikeType;
  user: IUser;
  post: IPost;
}
