import { PostsService } from '../../posts/services/posts.service';
import { IPost } from '../../posts/utils/models/post.interface';
import { COMMENT_CANNOT_BE_DELETED, COMMENT_COULD_NOT_BE_CREATED } from '../../utils/constants/errors.constants';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { CommentEntity } from '../models/comment.entity';
import { IComment } from '../models/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity) private readonly commentsRepository: Repository<CommentEntity>,
    private postsService: PostsService
  ) {}

  create(newLike: IComment): Observable<IPost> {
    return from(this.commentsRepository.save(newLike)).pipe(
      switchMap((createdComment: IComment) => this.postsService.findOne(createdComment.post.id)),
      catchError(() => throwError(() => new BadRequestException(COMMENT_COULD_NOT_BE_CREATED)))
    );
  }

  deleteOne(commentId: number, postId: number): Observable<IPost> {
    return from(this.commentsRepository.delete(commentId)).pipe(
      switchMap(() => this.postsService.findOne(postId)),
      catchError(() => throwError(() => new BadRequestException(COMMENT_CANNOT_BE_DELETED)))
    );
  }
}
