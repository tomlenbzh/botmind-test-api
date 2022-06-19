import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { IUser, UserRole } from '../utils/models/user.interface';
import { UserEntity } from '../utils/models/user.entity';
import { AuthService } from 'src/auth/service/auth.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import {
  ACCOUNT_NOT_FOUND,
  BAD_CREDENTIALS,
  CREDENTIALS_ALREADY_EXIST,
  USER_CANNOT_BE_DELETED,
  USER_NOT_FOUND
} from 'src/utils/constants/errors.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService
  ) {}

  /**
   * Creates a new User entity if it does not already exist in database.
   *
   * @param     { IUser }      user
   * @returns   { Observable<IUser> }
   */
  create(user: IUser): Observable<IUser> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user?.name || '';
        newUser.userName = user.userName;
        newUser.email = user.email;
        newUser.role = UserRole.USER;
        newUser.password = passwordHash;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: IUser) => this.getUserWithoutPassword(user)),
          catchError(() => throwError(() => new BadRequestException(CREDENTIALS_ALREADY_EXIST)))
        );
      })
    );
  }

  /**
   * Returns an array of all User entities in database.
   *
   * @returns   { Observable<IUser[]> }
   */
  findAll(): Observable<IUser[]> {
    return from(this.userRepository.find()).pipe(
      map((users: IUser[]) => {
        users.forEach((v) => delete v.password);
        return users;
      })
    );
  }

  /**
   * Returns one User entity with the corresponding id.
   *
   * @param     { number }      id
   * @returns   { Observable<IUser> }
   */
  findOne(id: number): Observable<IUser> {
    const options: FindOneOptions = { where: { id } };
    return from(this.userRepository.findOne(options)).pipe(
      switchMap((user: IUser) => of(this.getUserWithoutPassword(user))),
      catchError(() => throwError(() => new NotFoundException(USER_NOT_FOUND)))
    );
  }

  findOneByMail(email: string): Observable<IUser> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      switchMap((user: IUser) => of(this.getUserWithoutPassword(user))),
      catchError(() => throwError(() => new NotFoundException(USER_NOT_FOUND)))
    );
  }

  /**
   * Deletes one User entity with the corresponding id.
   *
   * @param     { number }      id
   * @returns   { Observable<any> }
   */
  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id)).pipe(
      catchError(() => throwError(() => new BadRequestException(USER_CANNOT_BE_DELETED)))
    );
  }

  /**
   * Updates one User entity with the corresponding id.
   *
   * @param     { number }      id
   * @param     { IUser }       user
   * @returns   { Observable<any> }
   */
  updateOne(id: number, user: IUser): Observable<IUser> {
    const { email, password, role, ...partialUser } = user;
    return from(this.userRepository.update(id, partialUser)).pipe(
      switchMap(() => this.findOne(id)),
      catchError((error: Error) => throwError(() => error))
    );
  }

  /**
   * Updates the role of the User entity with the corresponding id.
   *
   * @param     { number }      id
   * @param     { IUser }       user
   * @returns   { Observable<any> }
   */
  updateUserRole(id: number, user: IUser): Observable<IUser> {
    return from(this.userRepository.update(id, user)).pipe(
      switchMap(() => this.findOne(id)),
      catchError((error: Error) => throwError(() => error))
    );
  }

  /**
   * Returns a paginated list of IUser items.
   *
   * @param     { IPaginationOptions }      options
   * @returns   { Observable<Pagination<IUser>> }
   */
  paginate(options: IPaginationOptions): Observable<Pagination<IUser>> {
    return from(paginate<IUser>(this.userRepository, options)).pipe(
      map((pageContent: Pagination<IUser>) => {
        pageContent.items.forEach((user: IUser) => delete user.password);
        return pageContent;
      })
    );
  }

  /**
   * Returns a JSON Web Token if the user is properly authenticated.
   *
   * @param     { IUser }      user
   * @returns   { Observable<any> }
   */
  login(user: IUser): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((validatedUser: IUser) => {
        return validatedUser
          ? this.authService.generateJwtToken(validatedUser).pipe(map((token: string) => token))
          : throwError(() => new BadRequestException(BAD_CREDENTIALS));
      })
    );
  }

  /**
   * Returns a IUser item if :
   * - A user with the corresponding email is found.
   * - If the user's hashed password matches with the password parameter.
   *
   * @param     { string }      email
   * @param     { string }      password
   * @returns   { Observable<IUser> }
   */
  private validateUser(email: string, password: string): Observable<IUser> {
    return from(this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'password'] })).pipe(
      switchMap((user: IUser) => {
        return user
          ? this.authService
              .comparePasswords(password, user.password)
              .pipe(map((match: boolean) => (match ? this.getUserWithoutPassword(user) : null)))
          : throwError(() => new BadRequestException(ACCOUNT_NOT_FOUND));
      })
    );
  }

  /**
   * Returns a IUser item excluding the user's password.
   *
   * @param     { IUser }      user
   * @returns   { IUser }
   */
  private getUserWithoutPassword(user: IUser): IUser {
    const { password, ...result } = user;
    return result;
  }
}
