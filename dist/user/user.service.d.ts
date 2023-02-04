import mongoose, { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { createUserDto } from './dto/create-user.dto';
import { FileService } from 'src/file/file.service';
export declare const SECRET_JWT_KEY = "secret1234";
export interface UserRegisterResponse {
    _id: string;
    fullName: string;
    avatarUrl?: string;
    email: string;
    token: string;
}
export declare class UserService {
    private userModel;
    private fileService;
    constructor(userModel: Model<UserDocument>, fileService: FileService);
    create(dto: createUserDto, picture: any): Promise<UserRegisterResponse>;
    login(email: string, password: string): Promise<UserRegisterResponse>;
    getMe(userId: mongoose.Schema.Types.ObjectId): Promise<{
        email: string;
        _id: any;
        avatarUrl: string;
        fullName: string;
    }>;
    update(dto: createUserDto, picture: any, userId: mongoose.Schema.Types.ObjectId): Promise<UserRegisterResponse>;
    delete(userId: mongoose.Schema.Types.ObjectId): Promise<{
        message: string;
    }>;
}
