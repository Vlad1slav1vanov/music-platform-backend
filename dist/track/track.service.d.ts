import { Track, TrackDocument } from './schemas/track.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { FileService } from 'src/file/file.service';
import { createCommentDto } from './dto/create-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';
export declare class TrackService {
    private trackModel;
    private commentModel;
    private fileService;
    constructor(trackModel: Model<TrackDocument>, commentModel: Model<CommentDocument>, fileService: FileService);
    create(dto: CreateTrackDto, picture: any, audio: any, userId: ObjectId): Promise<Track>;
    getAll(count?: number, offset?: number): Promise<Track[]>;
    getNew(count?: number, offset?: number): Promise<Track[]>;
    getPopular(count?: number, offset?: number): Promise<Track[]>;
    getOne(id: ObjectId): Promise<Track>;
    delete(id: ObjectId, userId: ObjectId): Promise<Track['name']>;
    listen(id: ObjectId): Promise<void>;
    search(query: string): Promise<Track[]>;
    addComment(dto: createCommentDto, userId: ObjectId): Promise<Comment>;
    editComment(commentId: ObjectId, userId: ObjectId, text: any): Promise<Comment>;
    deleteComment(commentId: ObjectId, userId: ObjectId): Promise<void>;
}
