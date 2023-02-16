import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { CheckAuthGuard } from 'src/middleware/middleware.checkAuth';
import { createCommentDto } from './dto/create-comment.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Post()
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(@UploadedFiles() files, @Body() dto: CreateTrackDto, @Req() req) {
    const { picture, audio } = files;
    return this.trackService.create(
      dto,
      picture ? picture[0] : null,
      audio[0],
      req.userId,
    );
  }

  @Get()
  getAll(@Query('count') count: number, @Query('offset') offset: number) {
    return this.trackService.getAll(count, offset);
  }

  @Get('/new')
  getNew(@Query('count') count: number, @Query('offset') offset: number) {
    return this.trackService.getNew(count, offset);
  }

  @Get('/popular')
  getPopular(@Query('count') count: number, @Query('offset') offset: number) {
    return this.trackService.getPopular(count, offset);
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.trackService.search(query);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
  }

  @Delete(':id')
  @UseGuards(CheckAuthGuard)
  delete(@Param('id') id: ObjectId, @Req() req) {
    return this.trackService.delete(id, req.userId);
  }

  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }

  @Post('/comment')
  @UseGuards(CheckAuthGuard)
  addComment(@Body() dto: createCommentDto, @Req() req) {
    return this.trackService.addComment(dto, req.userId);
  }

  @Patch('/comment/:id')
  @UseGuards(CheckAuthGuard)
  editComment(@Param('id') commentId, @Req() req, @Body() { text }) {
    return this.trackService.editComment(commentId, req.userId, text);
  }

  @Delete('/comment/:id')
  @UseGuards(CheckAuthGuard)
  deleteComment(@Req() req, @Param('id') commentId) {
    return this.trackService.deleteComment(commentId, req.userId);
  }
}
