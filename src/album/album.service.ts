import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { CommentDocument } from 'src/track/schemas/comment.schema';
import { Track, TrackDocument } from 'src/track/schemas/track.schema';
import { Album, AlbumDocument } from './album.schema';
import { CreateAlbumDto } from './dto/CreateAlbum.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(picture, dto: CreateAlbumDto, userId: ObjectId) {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const album = await this.albumModel.create({
      picture: picturePath,
      user: userId,
      ...dto,
    });
    return album;
  }
}
