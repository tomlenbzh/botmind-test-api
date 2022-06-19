import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { LikeEntity } from '@likes/models/like.entity';
import { ILike } from '@likes/models/like.interface';
import { PostsService } from '@posts/services/posts.service';
import { IPost } from '@posts/utils/models/post.interface';
import { Repository } from 'typeorm';
import { LIKE_CANNOT_BE_DELETED, LIKE_COULD_NOT_BE_CREATED } from '@app/utils/constants/errors.constants';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikeEntity) private readonly likesRepository: Repository<LikeEntity>,
    private postsService: PostsService
  ) {}

  create(newLike: ILike): Observable<IPost> {
    return from(this.likesRepository.save(newLike)).pipe(
      switchMap((createdLike: ILike) => this.postsService.findOne(createdLike.post.id)),
      catchError(() => throwError(() => new BadRequestException(LIKE_COULD_NOT_BE_CREATED)))
    );
  }

  deleteOne(likeId: number, postId: number): Observable<IPost> {
    return from(this.likesRepository.delete(likeId)).pipe(
      switchMap(() => this.postsService.findOne(postId)),
      catchError(() => throwError(() => new BadRequestException(LIKE_CANNOT_BE_DELETED)))
    );
  }
}
