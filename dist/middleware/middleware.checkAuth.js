"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const user_service_1 = require("../user/user.service");
let CheckAuthGuard = class CheckAuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = (request.headers.authorization || '').replace(/Bearer\s?/, '');
        if (token) {
            try {
                const decoded = jwt.verify(token, user_service_1.SECRET_JWT_KEY);
                request.userId = decoded._id;
                return true;
            }
            catch (err) {
                throw new common_1.HttpException('Невалидный токен', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        else {
            throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
};
CheckAuthGuard = __decorate([
    (0, common_1.Injectable)()
], CheckAuthGuard);
exports.CheckAuthGuard = CheckAuthGuard;
//# sourceMappingURL=middleware.checkAuth.js.map