"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = exports.SECRET_JWT_KEY = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const file_service_1 = require("../file/file.service");
const class_validator_1 = require("class-validator");
exports.SECRET_JWT_KEY = 'secret1234';
let UserService = class UserService {
    constructor(userModel, fileService) {
        this.userModel = userModel;
        this.fileService = fileService;
    }
    async create(dto, picture) {
        try {
            const parsed = JSON.parse(JSON.stringify(dto));
            const errors = await (0, class_validator_1.validate)(parsed);
            console.log(errors);
            const picturePath = picture && this.fileService.createFile(file_service_1.FileType.IMAGE, picture);
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(dto.password, salt);
            const user = await this.userModel.create(Object.assign(Object.assign({}, dto), { passwordHash: hash, avatarUrl: picturePath }));
            const token = jwt.sign({
                _id: user._id,
            }, exports.SECRET_JWT_KEY, {
                expiresIn: '30d',
            });
            const { email, fullName, avatarUrl, _id } = user;
            return {
                email,
                _id,
                avatarUrl,
                fullName,
                token,
            };
        }
        catch (err) {
            if (err.code === 11000) {
                throw new common_1.HttpException('Данная почта уже занята', common_1.HttpStatus.BAD_REQUEST);
            }
            throw err;
        }
    }
    async login(email, password) {
        try {
            const user = await this.userModel.findOne({ email: email });
            const loginError = new common_1.HttpException('Неверный логин или пароль', common_1.HttpStatus.BAD_REQUEST);
            if (!user) {
                throw loginError;
            }
            const isValidPass = await bcrypt.compare(password, user.passwordHash);
            if (!isValidPass) {
                throw loginError;
            }
            const token = jwt.sign({
                _id: user._id,
            }, exports.SECRET_JWT_KEY, {
                expiresIn: '30d',
            });
            const { fullName, avatarUrl, _id } = user;
            return {
                email,
                _id,
                avatarUrl,
                fullName,
                token,
            };
        }
        catch (err) {
            throw err;
        }
    }
    async getMe(userId) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.BAD_REQUEST);
            }
            const { fullName, avatarUrl, _id, email } = user;
            return {
                email,
                _id,
                avatarUrl,
                fullName,
            };
        }
        catch (err) {
            throw err;
        }
    }
    async update(dto, picture, userId) {
        try {
            const updateObject = {};
            if (dto.password) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(dto.password, salt);
                updateObject.passwordHash = hash;
            }
            if (picture) {
                const picturePath = this.fileService.createFile(file_service_1.FileType.IMAGE, picture);
                updateObject.avatarUrl = picturePath;
            }
            Object.keys(dto).forEach((key) => {
                if (dto[key])
                    updateObject[key] = dto[key];
            });
            await this.userModel.updateOne({ _id: userId }, { $set: updateObject });
            const userData = await this.userModel.findById(userId);
            const token = jwt.sign({
                _id: userData._id,
            }, exports.SECRET_JWT_KEY, {
                expiresIn: '30d',
            });
            const { email, fullName, avatarUrl, _id } = userData;
            return {
                email,
                _id,
                avatarUrl,
                fullName,
                token,
            };
        }
        catch (err) {
            if (err.code === 11000) {
                throw new common_1.HttpException('Данная почта уже занята', common_1.HttpStatus.BAD_REQUEST);
            }
            throw err;
        }
    }
    async delete(userId) {
        try {
            await this.userModel.findByIdAndDelete(userId);
            return { message: 'Профиль удален' };
        }
        catch (err) {
            throw new common_1.HttpException('Не удалось удалить профиль', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        file_service_1.FileService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map