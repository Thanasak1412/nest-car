import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JWT_SECRET } from '../constants/configuration';
import { PUBLIC_ROUTES } from '../constants/request';
import { BEARER } from '../constants/token';
import { USER } from '../constants/user';
import { JwtPayload } from '../types/auth';
import { CurrentUserRequest } from '../types/users';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CurrentUserRequest>();
    const { userId } = request.cookies;

    const isPublicRoutes = PUBLIC_ROUTES.some((route) =>
      request.url.includes(route),
    );

    if (isPublicRoutes) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get(JWT_SECRET),
      });

      if (+userId !== payload.sub) {
        return false;
      }

      request[USER] = { id: payload.sub, email: payload.email };
    } catch (error) {
      console.error('Failed while verify token => ', error);

      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [tokenType, token] = request.headers.authorization?.split(' ') ?? [];

    return tokenType === BEARER ? token : undefined;
  }
}
