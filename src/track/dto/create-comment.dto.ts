import { ObjectId } from 'mongoose';

export class createCommentDto {
  readonly trackId: ObjectId;
  readonly text: string;
}
