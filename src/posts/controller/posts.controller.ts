import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { PostsService } from '@posts/services/posts.service';
import { IPost } from '@posts/utils/models/post.interface';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  /**
   * Inserts a new post in database if it doesn't already exist.
   *
   * @param     { IUser }      user
   * @returns   { Observable<IUser> }
   */
  @Post()
  create(@Body() post: IPost): Observable<IPost | any> {
    return this.postsService.create(post).pipe(
      map((post: IPost) => post),
      catchError((error: Error) => {
        throw error;
      })
    );
  }

  /**
   * Returns a paginated list of posts.
   *
   * @param     { number }      page
   * @param     { number }      limit
   * @returns   { Observable<Pagination<IPost, IPaginationMeta>> }
   */
  @Get('')
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ): Observable<Pagination<IPost, IPaginationMeta>> {
    return this.postsService.paginateAll({
      limit: limit,
      page: Number(page),
      route: '/posts'
    });
  }

  /**
   * Returns a paginated list of posts based on the provided user id.
   *
   * @param     { number }      page
   * @param     { number }      limit
   * @returns   { Observable<Pagination<IPost, IPaginationMeta>> }
   */
  @Get('user/:user')
  indexByUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Param('user') userId: number
  ) {
    return this.postsService.paginateByUser(
      {
        limit: Number(limit),
        page: Number(page),
        route: `/posts/user/${userId}`
      },
      Number(userId)
    );
  }

  /**
   * Returns a single post based on its id.
   *
   * @param     { string }      id
   * @returns   { Observable<IPost> }
   */
  @Get(':id')
  findOne(@Param('id') id: string): Observable<IPost> {
    return this.postsService.findOne(Number(id));
  }

  /**
   * Deletes a post and all related informations.
   *
   * @param     { string }      id
   * @returns   { Observable<IPost> }
   */
  @Delete(':id')
  delete(@Param('id') id: string): Observable<IPost> {
    return this.postsService.deleteOne(Number(id));
  }

  /**
   * Patches the specified post.
   *
   * @param     { string }      id
   * @param     { IPost }       post
   * @returns   { Observable<IPost> }
   */
  @Put(':id')
  updateOne(@Param('id') id: string, @Body() post: IPost): Observable<IPost> {
    return this.postsService.updateOne(Number(id), post).pipe(
      catchError((error: Error) => {
        throw error;
      })
    );
  }
}
