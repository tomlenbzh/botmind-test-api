import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from '@shared/generic.entity';
import { PostEntity } from '@posts/utils/models/post.entity';
import { UserEntity } from '@user/utils/models/user.entity';

export enum LikeType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

@Entity({ name: 'likes' })
export class LikeEntity extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: LikeType, type: 'enum', default: LikeType.LIKE, nullable: false })
  type: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post: PostEntity) => post.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;
}
