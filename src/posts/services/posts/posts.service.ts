import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { PostEntity } from 'src/posts/utils/models/post.entity';
import { IPost } from 'src/posts/utils/models/post.interface';
import { FindOneOptions, FindOptionsOrder, Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(PostEntity) private readonly postsRepository: Repository<PostEntity>) {}

  create(post: IPost): Observable<IPost> {
    return from(this.postsRepository.save(post)).pipe(
      map((createdPost: IPost) => createdPost),
      catchError(() => throwError(() => new BadRequestException('Your post could not be uploaded')))
    );
  }

  findOne(id: number): Observable<IPost> {
    const relations = ['user', 'likes', 'likes.user'];
    const options: FindOneOptions = { where: { id }, relations };

    return from(this.postsRepository.findOne(options)).pipe(
      map((post: IPost) => post),
      catchError(() => throwError(() => new NotFoundException('Post could not be found')))
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.postsRepository.delete(id)).pipe(
      catchError(() => throwError(() => new BadRequestException(`Post could not be deleted`)))
    );
  }

  findAll(): Observable<IPost[]> {
    const relations: string[] = ['user', 'likes', 'likes.user'];
    const order: FindOptionsOrder<IPost> = { createdAt: 'DESC' };
    return from(this.postsRepository.find({ relations, order }));
  }

  updateOne(id: number, post: IPost): Observable<IPost> {
    return from(this.postsRepository.update(id, post)).pipe(
      switchMap(() => this.findOne(id)),
      catchError((error: Error) => throwError(() => error))
    );
  }

  paginateAll(options: IPaginationOptions): Observable<Pagination<IPost>> {
    const relations: string[] = ['user', 'likes', 'likes.user'];
    const order: FindOptionsOrder<IPost> = { createdAt: 'DESC' };

    return from(paginate<IPost>(this.postsRepository, options, { relations, order })).pipe(
      map((posts: Pagination<IPost>) => posts)
    );
  }

  paginateByUser(options: IPaginationOptions, id: number): Observable<Pagination<IPost>> {
    const relations: string[] = ['user', 'likes', 'likes.user'];
    const order: FindOptionsOrder<IPost> = { createdAt: 'DESC' };

    return from(paginate<IPost>(this.postsRepository, options, { where: { user: { id } }, relations, order })).pipe(
      map((posts: Pagination<IPost>) => posts)
    );
  }
}
