import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { IPost } from '../../posts/utils/models/post.interface';
import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { IComment } from '../models/comment.interface';
import { CommentsService } from '../service/comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  /**
   * Inserts a Like entity in database and returns the associated post.
   *
   * @param       { ILike }      like
   * @returns     { Observable<IPost> }
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() comment: IComment): Observable<IPost> {
    return this.commentsService.create(comment).pipe(
      map((post: IPost) => post),
      catchError((error: Error) => {
        throw error;
      })
    );
  }

  /**
   * Deletes a Like entity from database ans returns the associated post.
   *
   * @param       { string }      id
   * @param       { IPost }       post
   * @returns     { Observable<IPost> }
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  delete(@Param('id') id: string, @Body() post: IPost): Observable<IPost> {
    return this.commentsService.deleteOne(Number(id), Number(post.id));
  }
}
