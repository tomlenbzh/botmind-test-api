export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface IUser {
  id?: number;
  name?: string;
  userName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  lang?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
