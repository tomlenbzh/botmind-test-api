import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { ILike } from '@likes/models/like.interface';
import { LikesService } from '@app/likes/service/likes.service';
import { IPost } from '@posts/utils/models/post.interface';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  /**
   * Inserts a Like entity in database and returns the associated post.
   * @param       { ILike }      like
   * @returns     { Observable<IPost> }
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() like: ILike): Observable<IPost> {
    return this.likesService.create(like).pipe(
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
    return this.likesService.deleteOne(Number(id), Number(post.id));
  }
}
