import { ObjectId } from 'mongoose';
export declare class CreateAlbumDto {
    readonly name: string;
    readonly artist: string;
    readonly tracks: ObjectId[];
}
