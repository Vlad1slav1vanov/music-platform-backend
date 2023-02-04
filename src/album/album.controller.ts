import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { CheckAuthGuard } from 'src/middleware/middleware.checkAuth';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/CreateAlbum.dto';

@Controller('/albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Post()
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  create(@UploadedFiles() files, @Body() dto: CreateAlbumDto, @Req() req) {
    const { picture } = files;
    return this.albumService.create(picture[0], dto, req.userId);
  }
}
