import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Track } from 'src/track/schemas/track.schema';
import { User } from 'src/user/user.schema';
export type AlbumDocument = Album & Document;
export declare class Album {
    name: string;
    artist: string;
    picture: string;
    commentsCount: number;
    user: User;
    tracks: Track[];
    comments: Comment[];
}
export declare const AlbumSchema: mongoose.Schema<Album, mongoose.Model<Album, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Album>;
