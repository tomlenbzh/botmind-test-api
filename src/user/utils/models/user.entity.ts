import { GenericEntity } from 'src/generic/generic.entity';
import { PostEntity } from 'src/posts/utils/models/post.entity';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user.interface';

@Entity()
export class UserEntity extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @BeforeInsert()
  emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(() => PostEntity, (post: PostEntity) => post.user)
  posts: PostEntity[];
  // @OneToMany(() => PostEntity, (post) => post.author)
  // posts: PostEntity[];
}
