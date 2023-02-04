import { ObjectId } from 'mongoose';
import { createCommentDto } from './dto/create-comment.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';
export declare class TrackController {
    private trackService;
    constructor(trackService: TrackService);
    create(files: any, dto: CreateTrackDto, req: any): Promise<import("./schemas/track.schema").Track>;
    getAll(count: number, offset: number): Promise<import("./schemas/track.schema").Track[]>;
    getNew(count: number, offset: number): Promise<import("./schemas/track.schema").Track[]>;
    getPopular(count: number, offset: number): Promise<import("./schemas/track.schema").Track[]>;
    search(query: string): Promise<import("./schemas/track.schema").Track[]>;
    getOne(id: ObjectId): Promise<import("./schemas/track.schema").Track>;
    delete(id: ObjectId, req: any): Promise<string>;
    listen(id: ObjectId): Promise<void>;
    addComment(dto: createCommentDto, req: any): Promise<import("./schemas/comment.schema").Comment>;
    editComment(commentId: any, req: any, { text }: {
        text: any;
    }): Promise<import("./schemas/comment.schema").Comment>;
    deleteComment(req: any, commentId: any): Promise<void>;
}
