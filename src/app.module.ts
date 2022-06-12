import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql', // TODO > PASS IT AS ENVIRONMENT VARIABLES
      host: 'localhost', // TODO > PASS IT AS ENVIRONMENT VARIABLES
      port: 8889, // TODO > PASS IT AS ENVIRONMENT VARIABLES
      username: 'root', // TODO > PASS IT AS ENVIRONMENT VARIABLES
      password: 'root', // TODO > PASS IT AS ENVIRONMENT VARIABLES
      database: 'botmind_test_db', // TODO > PASS IT AS ENVIRONMENT VARIABLES
      autoLoadEntities: true,
      entities: [],
      synchronize: true
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
