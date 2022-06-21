import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { GenericEntity } from '../../shared/generic.entity';
import { PostEntity } from '../../posts/utils/models/post.entity';
import { UserEntity } from '../../user/utils/models/user.entity';

@Entity({ name: 'comments' })
export class CommentEntity extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  content: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post: PostEntity) => post.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;
}
