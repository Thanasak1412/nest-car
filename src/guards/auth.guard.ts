import { Request } from 'express';
import { Observable } from 'rxjs';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { PUBLIC_ROUTES } from '../constants/request';

interface Cookies {
  [key: string]: string;
}

interface IRequest extends Request {
  cookies: Cookies;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<IRequest>();
    const { userId } = request.cookies;

    return !!userId || PUBLIC_ROUTES.includes(request.url);
  }
}
