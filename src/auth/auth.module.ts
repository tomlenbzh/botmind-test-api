import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UserModule } from 'src/user/user.module';
import { SECRET } from 'src/constants';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: SECRET, // TODO > PASS IN ENVIRONMENT VARIABLES
        signOptions: { expiresIn: '3600s' }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService]
})
export class AuthModule {}
