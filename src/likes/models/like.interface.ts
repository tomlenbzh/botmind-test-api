import { IPost } from '@posts/utils/models/post.interface';
import { IUser } from '@user/utils/models/user.interface';
import { LikeType } from './like.entity';

export interface ILike {
  id: number;
  type: LikeType;
  user: IUser;
  post: IPost;
}
