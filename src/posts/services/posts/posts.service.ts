import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { PostEntity } from 'src/posts/utils/models/post.entity';
import { IPost } from 'src/posts/utils/models/post.interface';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(PostEntity) private readonly postsRepository: Repository<PostEntity>) {}

  create(post: IPost): Observable<IPost> {
    return from(this.postsRepository.save(post)).pipe(
      map((createdPost: IPost) => createdPost),
      catchError((error) => {
        console.log('ERROR', error);
        console.log('post', post);
        return throwError(() => new BadRequestException('Your post could not be uploaded'));
      })
    );
  }

  findOne(id: number): Observable<IPost> {
    const options: FindOneOptions = { where: { id }, relations: ['user'] };
    return from(this.postsRepository.findOne(options)).pipe(
      map((post: IPost) => post),
      catchError(() => throwError(() => new NotFoundException()))
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.postsRepository.delete(id)).pipe(
      catchError(() => throwError(() => new BadRequestException(`User could not be deleted`)))
    );
  }

  findAll(): Observable<IPost[]> {
    return from(this.postsRepository.find({ relations: ['user'], order: { createdAt: 'DESC' } }));
  }

  updateOne(id: number, post: IPost): Observable<IPost> {
    return from(this.postsRepository.update(id, post)).pipe(
      switchMap(() => this.findOne(id)),
      catchError((error: Error) => throwError(() => error))
    );
  }

  paginateAll(options: IPaginationOptions): Observable<Pagination<IPost>> {
    return from(
      paginate<IPost>(this.postsRepository, options, { relations: ['user'], order: { createdAt: 'DESC' } })
    ).pipe(map((posts: Pagination<IPost>) => posts));
  }

  paginateByUser(options: IPaginationOptions, id: number): Observable<Pagination<IPost>> {
    return from(
      paginate<IPost>(this.postsRepository, options, {
        where: { user: { id } },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      })
    ).pipe(map((posts: Pagination<IPost>) => posts));
  }
}
