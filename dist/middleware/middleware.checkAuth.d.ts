import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class CheckAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
