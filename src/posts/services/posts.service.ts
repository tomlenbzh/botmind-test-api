import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { PostEntity } from '@posts/utils/models/post.entity';
import { IPost } from '@posts/utils/models/post.interface';
import { FindOneOptions, FindOptionsOrder, Repository } from 'typeorm';
import {
  POST_CANNOT_BE_DELETED,
  POST_COULD_NOT_BE_CREATED,
  POST_NOT_FOUND
} from 'src/utils/constants/errors.constants';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(PostEntity) private readonly postsRepository: Repository<PostEntity>) {}

  /**
   * Creates a new Post entity if it does not already exist in database.
   *
   * @param     { IUser }      user
   * @returns   { Observable<IPost> }
   */
  create(post: IPost): Observable<IPost> {
    return from(this.postsRepository.save(post)).pipe(
      map((createdPost: IPost) => createdPost),
      catchError(() => throwError(() => new BadRequestException(POST_COULD_NOT_BE_CREATED)))
    );
  }

  /**
   * Returns an array of all Post entities in database.
   *
   * @returns   { Observable<IPost[]> }
   */
  findAll(): Observable<IPost[]> {
    const relations: string[] = ['user', 'likes', 'likes.user'];
    const order: FindOptionsOrder<IPost> = { updatedAt: 'DESC' };
    return from(this.postsRepository.find({ relations, order }));
  }

  /**
   * Returns one Post entity with the corresponding id.
   *
   * @param     { number }      id
   * @returns   { Observable<IPost> }
   */
  findOne(id: number): Observable<IPost> {
    const relations = ['user', 'likes', 'likes.user'];
    const options: FindOneOptions = { where: { id }, relations };

    return from(this.postsRepository.findOne(options)).pipe(
      map((post: IPost) => post),
      catchError(() => throwError(() => new NotFoundException(POST_NOT_FOUND)))
    );
  }

  /**
   * Deletes one Post entity with the corresponding id.
   *
   * @param     { number }      id
   * @returns   { Observable<any> }
   */
  deleteOne(id: number): Observable<any> {
    return from(this.postsRepository.delete(id)).pipe(
      catchError(() => throwError(() => new BadRequestException(POST_CANNOT_BE_DELETED)))
    );
  }

  /**
   * Updates one Post entity with the corresponding id.
   *
   * @param     { number }      id
   * @param     { IPost }       post
   * @returns   { Observable<IPost> }
   */
  updateOne(id: number, post: IPost): Observable<IPost> {
    const { likes, updatedAt, ...partialPost } = post;
    return from(this.postsRepository.update(id, partialPost)).pipe(
      switchMap(() => this.findOne(id)),
      catchError((error: Error) => throwError(() => new BadRequestException(error)))
    );
  }

  /**
   * Returns a paginated list of IPost items.
   *
   * @param     { IPaginationOptions }      options
   * @returns   { Observable<Pagination<IUser>> }
   */
  paginateAll(options: IPaginationOptions): Observable<Pagination<IPost>> {
    const relations: string[] = ['user', 'likes', 'likes.user'];
    const order: FindOptionsOrder<IPost> = { updatedAt: 'DESC' };

    return from(paginate<IPost>(this.postsRepository, options, { relations, order })).pipe(
      map((posts: Pagination<IPost>) => posts)
    );
  }

  /**
   * Returns a paginated list of IPost items based on the provided user id.
   *
   * @param     { IPaginationOptions }      options
   * @returns   { Observable<Pagination<IUser>> }
   */
  paginateByUser(options: IPaginationOptions, id: number): Observable<Pagination<IPost>> {
    const relations: string[] = ['user', 'likes', 'likes.user'];
    const order: FindOptionsOrder<IPost> = { updatedAt: 'DESC' };

    return from(paginate<IPost>(this.postsRepository, options, { where: { user: { id } }, relations, order })).pipe(
      map((posts: Pagination<IPost>) => posts)
    );
  }
}
