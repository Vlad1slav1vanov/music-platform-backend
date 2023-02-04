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
exports.AlbumService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const file_service_1 = require("../file/file.service");
const track_schema_1 = require("../track/schemas/track.schema");
const album_schema_1 = require("./album.schema");
let AlbumService = class AlbumService {
    constructor(albumModel, trackModel, commentModel, fileService) {
        this.albumModel = albumModel;
        this.trackModel = trackModel;
        this.commentModel = commentModel;
        this.fileService = fileService;
    }
    async create(picture, dto, userId) {
        const picturePath = this.fileService.createFile(file_service_1.FileType.IMAGE, picture);
        const album = await this.albumModel.create(Object.assign({ picture: picturePath, user: userId }, dto));
        return album;
    }
};
AlbumService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(album_schema_1.Album.name)),
    __param(1, (0, mongoose_1.InjectModel)(track_schema_1.Track.name)),
    __param(2, (0, mongoose_1.InjectModel)(Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        file_service_1.FileService])
], AlbumService);
exports.AlbumService = AlbumService;
//# sourceMappingURL=album.service.js.map