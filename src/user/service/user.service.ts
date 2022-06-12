import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { from, Observable } from 'rxjs';

import { UserEntity } from '../models/user.entity';
import { IUser } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Creates a new User entity if it does not already exists in database.
   *
   * @param     { IUser }      user
   * @returns   { Observable<IUser> }
   */
  create(user: IUser): Observable<IUser> {
    return from(this.userRepository.save(user));
  }

  /**
   * Returns an array of all User entities in database.
   *
   * @param     { IUser }      user
   * @returns   { Observable<IUser[]> }
   */
  findAll(): Observable<IUser[]> {
    return from(this.userRepository.find());
  }

  /**
   * Returns one User entity with the corresponding id.
   *
   * @param     { number }      id
   * @returns   { Observable<IUser> }
   */
  findOne(id: number): Observable<IUser> {
    const options: FindOneOptions = { where: { id } };
    return from(this.userRepository.findOne(options));
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
   * @returns   { Observable<any> }
   */
  updateOne(id: number, user: IUser): Observable<any> {
    return from(this.userRepository.update(id, user));
  }
}
