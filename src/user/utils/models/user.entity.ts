import { GenericEntity } from 'src/generic/generic.entity';
import { LikeEntity } from 'src/likes/models/like.entity';
import { PostEntity } from 'src/posts/utils/models/post.entity';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user.interface';

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

  @BeforeInsert()
  emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(() => PostEntity, (post: PostEntity) => post.user)
  posts: PostEntity[];

  @OneToMany(() => LikeEntity, (like: LikeEntity) => like.user, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  likes: LikeEntity[];
}
