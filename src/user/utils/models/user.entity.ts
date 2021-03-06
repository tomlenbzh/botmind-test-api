import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GenericEntity } from '@shared/generic.entity';
import { LikeEntity } from '@likes/models/like.entity';
import { PostEntity } from '@posts/utils/models/post.entity';
import { UserRole } from './user.interface';
import { CommentEntity } from '@app/comments/models/comment.entity';

@Entity({ name: 'users' })
export class UserEntity extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: 'fr' })
  lang: string;

  @Column({ default: 'No description' })
  description: string;

  @Column({ default: '' })
  image: string;

  @BeforeInsert()
  emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(() => PostEntity, (post: PostEntity) => post.user)
  posts: PostEntity[];

  @OneToMany(() => LikeEntity, (like: LikeEntity) => like.user, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  likes: LikeEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  comments: LikeEntity[];
}
