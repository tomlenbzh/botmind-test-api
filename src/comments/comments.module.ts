import { PostsModule } from '../posts/posts.module';
import { UserModule } from '../user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './controller/comments.controller';
import { CommentEntity } from './models/comment.entity';
import { CommentsService } from './service/comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), PostsModule, UserModule],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
