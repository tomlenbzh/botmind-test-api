import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { GenericEntity } from '@shared/generic.entity';
import { LikeEntity } from '@likes/models/like.entity';
import { UserEntity } from '@user/utils/models/user.entity';

@Entity({ name: 'posts' })
export class PostEntity extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column('text')
  body: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.posts, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => LikeEntity, (like: LikeEntity) => like.post, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  likes: LikeEntity[];
}
