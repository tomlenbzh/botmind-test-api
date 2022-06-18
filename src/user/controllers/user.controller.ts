import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable, switchMap } from 'rxjs';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserService } from '../services/user.service';
import { IUser, UserRole } from '../utils/models/user.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: IUser): Observable<IUser | any> {
    return this.userService.create(user).pipe(
      map((user: IUser) => user),
      catchError((error: Error) => {
        throw error;
      })
    );
  }

  @Post('login')
  login(@Body() user: IUser): Observable<any> {
    return this.userService.login(user).pipe(
      switchMap((token: string) =>
        this.userService.findOneByMail(user.email).pipe(map((res: IUser) => ({ token, user: res })))
      ),
      catchError((error: Error) => {
        throw error;
      })
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string): Observable<IUser> {
    return this.userService.findOne(Number(id));
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  index(@Query('page') page = 1, @Query('page') limit = 10): Observable<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit; // * Restrict the maximium number of returned items.
    return this.userService.paginate({ page, limit, route: 'http://localhost:3000/users' });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  @Put(':id/role')
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateUserRole(@Param('id') id: string, @Body() user: IUser): Observable<any> {
    return this.userService.updateUserRole(Number(id), user);
  }

  /**
   * Updates one user's information.
   *
   * @param     { string }      id
   * @param     { string }      user
   * @returns   { Observable<any> }
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateOne(@Param('id') id: string, @Body() user: IUser): Observable<any> {
    return this.userService.updateOne(Number(id), user).pipe(
      catchError((error: Error) => {
        throw error;
      })
    );
  }
}
