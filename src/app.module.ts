import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { PostsModule } from '@posts/posts.module';
import { LikesModule } from '@likes/likes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'us-cdbr-east-05.cleardb.net',
      username: 'b270ec79737817',
      password: '26796824',
      database: 'heroku_6a5e9e80b0fde01',
      autoLoadEntities: true,
      entities: [],
      synchronize: true
    }),
    UserModule,
    AuthModule,
    PostsModule,
    LikesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
