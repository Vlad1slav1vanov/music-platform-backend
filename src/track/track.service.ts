import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Track, TrackDocument } from './schemas/track.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { FileService, FileType } from 'src/file/file.service';
import { createCommentDto } from './dto/create-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(
    dto: CreateTrackDto,
    picture,
    audio,
    userId: ObjectId,
  ): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    let picturePath = null;
    if (picture) {
      picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    }
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
      user: userId,
    });
    return track;
  }

  async getAll(count = 10, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel.find().skip(offset).limit(count);
    return tracks;
  }

  async getNew(count = 10, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);
    return tracks;
  }

  async getPopular(count = 10, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel
      .find()
      .sort({ listens: -1 })
      .skip(offset)
      .limit(count);
    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(id).populate({
      path: 'comments',
      populate: { path: 'user', select: 'fullName avatarUrl' },
    });
    return track;
  }

  async delete(id: ObjectId, userId: ObjectId): Promise<Track['name']> {
    const track = await this.trackModel.findByIdAndDelete(id);
    if (track.user.toString() !== userId.toString()) {
      throw new HttpException(
        'Только автор может удалить трек',
        HttpStatus.BAD_REQUEST,
      );
    }
    return track.name;
  }

  async listen(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    track.save();
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return tracks;
  }

  async addComment(dto: createCommentDto, userId: ObjectId): Promise<Comment> {
    const comment = await this.commentModel.create({
      user: userId,
      track: dto.trackId,
      text: dto.text,
    });

    await this.trackModel.findOneAndUpdate(
      { _id: dto.trackId },
      {
        $push: {
          comments: comment._id,
        },
        $inc: {
          commentsCount: 1,
        },
      },
    );

    return comment;
  }

  async editComment(
    commentId: ObjectId,
    userId: ObjectId,
    text,
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
    if (comment.user.toString() !== userId.toString()) {
      throw new UnauthorizedException('Авторизация не пройдена');
    }
    const updatedComment = await this.commentModel.findOneAndUpdate(
      { _id: commentId },
      {
        text: text,
      },
      { new: true },
    );
    return updatedComment;
  }

  async deleteComment(commentId: ObjectId, userId: ObjectId) {
    const comment = await this.commentModel.findById(commentId);
    if (comment.user.toString() !== userId.toString()) {
      throw new UnauthorizedException('Авторизация не пройдена');
    }
    await this.commentModel.findByIdAndDelete({ _id: commentId });
    await this.trackModel.findOneAndUpdate(
      { _id: comment.track },
      {
        $pull: {
          comments: { $in: comment._id },
        },
        $inc: {
          commentsCount: -1,
        },
      },
    );
    throw new HttpException('Комментарий удален', HttpStatus.ACCEPTED);
  }
}
