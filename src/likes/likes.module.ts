import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './models/like.entity';
import { LikesController } from './controller/likes.controller';
import { PostsModule } from '@posts/posts.module';
import { LikesService } from './service/likes.service';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity]), PostsModule, UserModule],
  providers: [LikesService],
  controllers: [LikesController]
})
export class LikesModule {}
