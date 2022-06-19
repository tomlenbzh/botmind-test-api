import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { PostsService } from 'src/posts/services/posts/posts.service';
import { IPost } from 'src/posts/utils/models/post.interface';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  create(@Body() post: IPost): Observable<IPost | any> {
    return this.postsService.create(post).pipe(
      map((post: IPost) => post),
      catchError((error: Error) => {
        throw error;
      })
    );
  }

  @Get('')
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.postsService.paginateAll({
      limit: limit,
      page: Number(page),
      route: 'http://localhost:3000/api/posts'
    });
  }

  @Get('user/:user')
  indexByUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Param('user') userId: number
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.postsService.paginateByUser(
      {
        limit: Number(limit),
        page: Number(page),
        route: `http://localhost:3000/api/posts/user/${userId}`
      },
      Number(userId)
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IPost> {
    return this.postsService.findOne(Number(id));
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<IPost> {
    return this.postsService.deleteOne(Number(id));
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() post: IPost): Observable<IPost> {
    return this.postsService.updateOne(Number(id), post).pipe(
      catchError((error: Error) => {
        throw error;
      })
    );
  }
}
