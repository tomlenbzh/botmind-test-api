import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { IUser, UserRole } from '../utils/models/user.interface';
import { UserEntity } from '../utils/models/user.entity';
import { AuthService } from 'src/auth/service/auth.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService
  ) {}

  /**
   * Creates a new User entity if it does not already exists in database.
   *
   * @param     { IUser }      user
   * @returns   { Observable<IUser> }
   */
  create(user: IUser): Observable<IUser> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.userName = user.userName;
        newUser.email = user.email;
        newUser.role = UserRole.USER;
        newUser.password = passwordHash;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: IUser) => this.getUserWithoutPassword(user)),
          catchError((error) => throwError(() => new Error(error)))
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
    return from(this.userRepository.findOne(options)).pipe(map((user: IUser) => this.getUserWithoutPassword(user)));
  }

  /**
   * Deletes one User entity with the corresponding id.
   *
   * @param     { number }      id
   * @returns   { Observable<any> }
   */
  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  /**
   * Updates one User entity with the corresponding id.
   *
   * @param     { number }      id
   * @param     { IUser }       user
   * @returns   { Observable<any> }
   */
  updateOne(id: number, user: IUser): Observable<any> {
    const { email, password, role, ...partialUser } = user;
    return from(this.userRepository.update(id, partialUser));
  }

  /**
   * Updates the role of the User entity with the corresponding id.
   *
   * @param     { number }      id
   * @param     { IUser }       user
   * @returns   { Observable<any> }
   */
  updateUserRole(id: number, user: IUser): Observable<any> {
    return from(this.userRepository.update(id, user));
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

  login(user: IUser): Observable<any> {
    console.log('LOGIN', user);
    return this.validateUser(user.email, user.password).pipe(
      switchMap((validatedUser: IUser) => {
        return validatedUser
          ? this.authService.generateJwtToken(validatedUser).pipe(map((token: string) => token))
          : throwError(() => new Error('WRONG CREDENTIALS'));
      }),
      catchError((error: any) => throwError(() => new Error(error)))
    );
  }

  // findUserByEmail(email: string): Observable<IUser> {
  //   return from(this.userRepository.findOne({ where: { email } }));
  // }

  private validateUser(email: string, password: string): Observable<IUser> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      switchMap((user: IUser) => {
        console.log('validateUser', user);
        console.log('credentials', email, password);

        return this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            console.log('MATCH ?', match);
            if (match === true) {
              return this.getUserWithoutPassword(user);
            } else {
              throwError(() => ({ message: 'FUCK' }));
            }
          })
        );
      })
    );
  }

  private getUserWithoutPassword(user: IUser): IUser {
    const { password, ...result } = user;
    return result;
  }
}
