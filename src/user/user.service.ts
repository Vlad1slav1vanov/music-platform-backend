import { HttpException, HttpStatus, Injectable, Next } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { createUserDto } from './dto/create-user.dto';
import { FileService, FileType } from 'src/file/file.service';
import { validate, validateOrReject } from 'class-validator';

export const SECRET_JWT_KEY = 'secret1234';

export interface UserRegisterResponse {
  _id: string;
  fullName: string;
  avatarUrl?: string;
  email: string;
  token: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: createUserDto, picture): Promise<UserRegisterResponse> {
    try {
      const parsed = JSON.parse(JSON.stringify(dto));
      const errors = await validate(parsed);
      console.log(errors);
      const picturePath =
        picture && this.fileService.createFile(FileType.IMAGE, picture);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(dto.password, salt);
      const user = await this.userModel.create({
        ...dto,
        passwordHash: hash,
        avatarUrl: picturePath,
      });

      const token = jwt.sign(
        {
          _id: user._id,
        },
        SECRET_JWT_KEY,
        {
          expiresIn: '30d',
        },
      );

      const { email, fullName, avatarUrl, _id } = user;

      return {
        email,
        _id,
        avatarUrl,
        fullName,
        token,
      };
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException(
          'Данная почта уже занята',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw err;
    }
  }

  async login(email: string, password: string): Promise<UserRegisterResponse> {
    try {
      const user = await this.userModel.findOne({ email: email });
      const loginError = new HttpException(
        'Неверный логин или пароль',
        HttpStatus.BAD_REQUEST,
      );

      if (!user) {
        throw loginError;
      }

      const isValidPass = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPass) {
        throw loginError;
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        SECRET_JWT_KEY,
        {
          expiresIn: '30d',
        },
      );

      const { fullName, avatarUrl, _id } = user;

      return {
        email,
        _id,
        avatarUrl,
        fullName,
        token,
      };
    } catch (err) {
      throw err;
    }
  }

  async getMe(userId: mongoose.Schema.Types.ObjectId) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new HttpException(
          'Пользователь не найден',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { fullName, avatarUrl, _id, email } = user;

      return {
        email,
        _id,
        avatarUrl,
        fullName,
      };
    } catch (err) {
      throw err;
    }
  }

  async update(
    dto: createUserDto,
    picture,
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<UserRegisterResponse> {
    try {
      const updateObject: Record<string, any> = {};

      if (dto.password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(dto.password, salt);
        updateObject.passwordHash = hash;
      }

      if (picture) {
        const picturePath = this.fileService.createFile(
          FileType.IMAGE,
          picture,
        );
        updateObject.avatarUrl = picturePath;
      }

      Object.keys(dto).forEach((key) => {
        if (dto[key]) updateObject[key] = dto[key];
      });

      await this.userModel.updateOne({ _id: userId }, { $set: updateObject });

      const userData = await this.userModel.findById(userId);

      const token = jwt.sign(
        {
          _id: userData._id,
        },
        SECRET_JWT_KEY,
        {
          expiresIn: '30d',
        },
      );

      const { email, fullName, avatarUrl, _id } = userData;

      return {
        email,
        _id,
        avatarUrl,
        fullName,
        token,
      };
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException(
          'Данная почта уже занята',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw err;
    }
  }

  async delete(userId: mongoose.Schema.Types.ObjectId) {
    try {
      await this.userModel.findByIdAndDelete(userId);
      return { message: 'Профиль удален' };
    } catch (err) {
      throw new HttpException(
        'Не удалось удалить профиль',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
