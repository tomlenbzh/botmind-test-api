import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './models/like.entity';
import { LikesController } from './controller/likes/likes.controller';
import { PostsModule } from 'src/posts/posts.module';
import { LikesService } from './services/likes/likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity]), PostsModule],
  providers: [LikesService],
  controllers: [LikesController]
})
export class LikesModule {}
