import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from 'src/file/file.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, FileService],
})
export class UserModule {}
