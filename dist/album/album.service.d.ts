import { Model, ObjectId } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { CommentDocument } from 'src/track/schemas/comment.schema';
import { TrackDocument } from 'src/track/schemas/track.schema';
import { Album, AlbumDocument } from './album.schema';
import { CreateAlbumDto } from './dto/CreateAlbum.dto';
export declare class AlbumService {
    private albumModel;
    private trackModel;
    private commentModel;
    private fileService;
    constructor(albumModel: Model<AlbumDocument>, trackModel: Model<TrackDocument>, commentModel: Model<CommentDocument>, fileService: FileService);
    create(picture: any, dto: CreateAlbumDto, userId: ObjectId): Promise<Album & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
