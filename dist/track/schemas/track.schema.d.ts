import { Document } from 'mongoose';
import { Comment } from './comment.schema';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.schema';
export type TrackDocument = Track & Document;
export declare class Track {
    name: string;
    artist: string;
    text: string;
    listens: number;
    picture: string;
    audio: string;
    user: User;
    commentsCount: number;
    comments: Comment[];
}
export declare const TrackSchema: mongoose.Schema<Track, mongoose.Model<Track, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Track>;
