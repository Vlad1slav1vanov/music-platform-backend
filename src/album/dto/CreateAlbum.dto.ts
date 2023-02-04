import { ObjectId } from 'mongoose';

export class CreateAlbumDto {
  readonly name: string;
  readonly artist: string;
  readonly tracks: ObjectId[];
}
