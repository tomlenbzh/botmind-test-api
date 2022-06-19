import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { LikeEntity } from 'src/likes/models/like.entity';
import { ILike } from 'src/likes/models/like.interface';
import { PostsService } from 'src/posts/services/posts/posts.service';
import { IPost } from 'src/posts/utils/models/post.interface';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikeEntity) private readonly likesRepository: Repository<LikeEntity>,
    private postsService: PostsService
  ) {}

  create(newLike: ILike): Observable<IPost> {
    return from(this.likesRepository.save(newLike)).pipe(
      switchMap((createdLike: ILike) => this.postsService.findOne(createdLike.post.id)),
      catchError((error) => {
        console.log('error', error);
        return throwError(() => new BadRequestException('Your like could not be uploaded'));
      })
    );
  }

  deleteOne(likeId: number, postId: number): Observable<IPost> {
    console.log('LIKE ID:', likeId);
    console.log('POST ID:', postId);

    return from(this.likesRepository.delete(likeId)).pipe(
      switchMap(() => this.postsService.findOne(postId)),
      catchError(() => throwError(() => new BadRequestException(`Like could not be deleted`)))
    );
  }
}
