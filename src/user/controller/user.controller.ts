import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { catchError, map, Observable, switchMap } from 'rxjs';
import { Pagination } from 'nestjs-typeorm-paginate';
import { hasRoles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { UserService } from '../service/user.service';
import { IUser, UserRole } from '../utils/models/user.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Inserts a new user in database if it doesn't already exist.
   *
   * @param     { IUser }      user
   * @returns   { Observable<IUser> }
   */
  @Post()
  create(@Body() user: IUser): Observable<IUser> {
    return this.userService.create(user).pipe(
      map((user: IUser) => user),
      catchError((error: Error) => {
        throw error;
      })
    );
  }

  /**
   * Returns a JSON Web Token and the authenticated user information.
   *
   * @param     { IUser }     user
   * @returns   { Observable<any> }
   */
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

  /**
   * Returns a single user based on its id.
   *
   * @param     { string }      id
   * @returns   { Observable<IUser> }
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string): Observable<IUser> {
    return this.userService.findOne(Number(id));
  }

  /**
   * Returns a paginated list of users.
   *
   * @param     { number }      page
   * @param     { number }      limit
   * @returns   { Observable<Pagination<IUser>> }
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  index(@Query('page') page = 1, @Query('page') limit = 10): Observable<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate({ page, limit, route: 'http://localhost:3000/users' });
  }

  /**
   * Deletes a user and all related informations.
   *
   * @param     { string }      id
   * @returns   { Observable<any> }
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  /**
   * Patches the role of a user of is ADMIN.
   *
   * @param     { string }      id
   * @param     { IUser }       user
   * @returns   { Observable<IUser> }
   */
  @Put(':id/role')
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateUserRole(@Param('id') id: string, @Body() user: IUser): Observable<IUser> {
    return this.userService.updateUserRole(Number(id), user);
  }

  /**
   * Updates one user's information.
   *
   * @param     { string }      id
   * @param     { string }      user
   * @returns   { Observable<IUser> }
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateOne(@Param('id') id: string, @Body() user: IUser): Observable<IUser> {
    return this.userService.updateOne(Number(id), user).pipe(
      catchError((error: Error) => {
        throw error;
      })
    );
  }
}
