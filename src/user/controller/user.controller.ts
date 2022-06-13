import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserService } from '../service/user.service';
import { IUser, UserRole } from '../utils/models/user.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: IUser): Observable<IUser | any> {
    return this.userService.create(user).pipe(
      map((user: IUser) => user)
      // catchError((error: any) => of({ error: error?.message }))
    );
  }

  @Post('login')
  login(@Body() user: IUser): Observable<any> {
    return this.userService.login(user).pipe(
      map((jwt: string) => ({ accessToken: jwt })),
      catchError((error: Error) => of(error))
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IUser> {
    return this.userService.findOne(Number(id));
  }

  // @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  index(@Query('page') page = 1, @Query('page') limit = 10): Observable<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit; // * Restrict the maximium number of returned items.
    return this.userService.paginate({ page, limit, route: 'http://localhost:3000/users' });
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
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
  updateOne(@Param('id') id: string, @Body() user: IUser): Observable<any> {
    return this.userService
      .updateOne(Number(id), user)
      .pipe(catchError((error: Error) => of({ error: error?.message })));
  }
}
