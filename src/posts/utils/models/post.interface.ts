import { IUser } from '@user/utils/models/user.interface';

export interface IPost {
  id?: number;
  title?: string;
  body?: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: IUser;
}