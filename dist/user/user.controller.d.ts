import { createUserDto } from './dto/create-user.dto';
import { UserRegisterResponse, UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    create(files: any, dto: createUserDto): Promise<UserRegisterResponse>;
    login({ email, password }: {
        email: any;
        password: any;
    }): Promise<UserRegisterResponse>;
    getMe(req: any): Promise<{
        email: string;
        _id: any;
        avatarUrl: string;
        fullName: string;
    }>;
    update(files: any, dto: createUserDto, req: any): Promise<UserRegisterResponse>;
    delete(req: any): Promise<{
        message: string;
    }>;
}
