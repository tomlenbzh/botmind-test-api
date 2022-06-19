import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { ILike } from 'src/likes/models/like.interface';
import { LikesService } from 'src/likes/services/likes/likes.service';
import { IPost } from 'src/posts/utils/models/post.interface';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post()
  create(@Body() like: ILike): Observable<IPost> {
    return this.likesService.create(like).pipe(
      map((post: IPost) => post),
      catchError((error: Error) => {
        throw error;
      })
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Body() post: IPost): Observable<IPost> {
    return this.likesService.deleteOne(Number(id), Number(post.id));
  }
}
