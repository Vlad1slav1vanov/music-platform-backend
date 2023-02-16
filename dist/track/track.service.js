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
exports.TrackService = void 0;
const common_1 = require("@nestjs/common");
const track_schema_1 = require("./schemas/track.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const file_service_1 = require("../file/file.service");
const comment_schema_1 = require("./schemas/comment.schema");
let TrackService = class TrackService {
    constructor(trackModel, commentModel, fileService) {
        this.trackModel = trackModel;
        this.commentModel = commentModel;
        this.fileService = fileService;
    }
    async create(dto, picture, audio, userId) {
        const audioPath = this.fileService.createFile(file_service_1.FileType.AUDIO, audio);
        let picturePath = null;
        if (picture) {
            picturePath = this.fileService.createFile(file_service_1.FileType.IMAGE, picture);
        }
        const track = await this.trackModel.create(Object.assign(Object.assign({}, dto), { listens: 0, audio: audioPath, picture: picturePath, user: userId }));
        return track;
    }
    async getAll(count = 10, offset = 0) {
        const tracks = await this.trackModel.find().skip(offset).limit(count);
        return tracks;
    }
    async getNew(count = 10, offset = 0) {
        const tracks = await this.trackModel
            .find()
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(count);
        return tracks;
    }
    async getPopular(count = 10, offset = 0) {
        const tracks = await this.trackModel
            .find()
            .sort({ listens: -1 })
            .skip(offset)
            .limit(count);
        return tracks;
    }
    async getOne(id) {
        const track = await this.trackModel.findById(id).populate({
            path: 'comments',
            populate: { path: 'user', select: 'fullName avatarUrl' },
        });
        return track;
    }
    async delete(id, userId) {
        const track = await this.trackModel.findByIdAndDelete(id);
        if (track.user.toString() !== userId.toString()) {
            throw new common_1.HttpException('Только автор может удалить трек', common_1.HttpStatus.BAD_REQUEST);
        }
        return track.name;
    }
    async listen(id) {
        const track = await this.trackModel.findById(id);
        track.listens += 1;
        track.save();
    }
    async search(query) {
        const tracks = await this.trackModel.find({
            name: { $regex: new RegExp(query, 'i') },
        });
        return tracks;
    }
    async addComment(dto, userId) {
        const comment = await this.commentModel.create({
            user: userId,
            track: dto.trackId,
            text: dto.text,
        });
        await this.trackModel.findOneAndUpdate({ _id: dto.trackId }, {
            $push: {
                comments: comment._id,
            },
            $inc: {
                commentsCount: 1,
            },
        });
        return comment;
    }
    async editComment(commentId, userId, text) {
        const comment = await this.commentModel.findById(commentId);
        if (comment.user.toString() !== userId.toString()) {
            throw new common_1.UnauthorizedException('Авторизация не пройдена');
        }
        const updatedComment = await this.commentModel.findOneAndUpdate({ _id: commentId }, {
            text: text,
        }, { new: true });
        return updatedComment;
    }
    async deleteComment(commentId, userId) {
        const comment = await this.commentModel.findById(commentId);
        if (comment.user.toString() !== userId.toString()) {
            throw new common_1.UnauthorizedException('Авторизация не пройдена');
        }
        await this.commentModel.findByIdAndDelete({ _id: commentId });
        await this.trackModel.findOneAndUpdate({ _id: comment.track }, {
            $pull: {
                comments: { $in: comment._id },
            },
            $inc: {
                commentsCount: -1,
            },
        });
        throw new common_1.HttpException('Комментарий удален', common_1.HttpStatus.ACCEPTED);
    }
};
TrackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(track_schema_1.Track.name)),
    __param(1, (0, mongoose_2.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        file_service_1.FileService])
], TrackService);
exports.TrackService = TrackService;
//# sourceMappingURL=track.service.js.map