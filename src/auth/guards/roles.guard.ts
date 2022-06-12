import { Injectable, CanActivate, ExecutionContext, forwardRef, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { UserService } from 'src/user/service/user.service';
import { IUser } from 'src/user/utils/models/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(forwardRef(() => UserService)) private userService: UserService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;

    return this.userService.findOne(user.id).pipe(
      map((user: IUser) => {
        const hasRole = () => roles.indexOf(user.role) > -1;
        const hasPermission: boolean = hasRole();
        return user && hasPermission;
      })
    );
  }
}
