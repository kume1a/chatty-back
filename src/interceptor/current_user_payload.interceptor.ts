import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtTokenExtractor } from '../helper/jwt_token.extractor';
import { JwtHelper } from '../helper/jwt.helper';
import { UserPayload } from '../model/common/user_payload';

export interface UserPayloadRequest extends Request {
  userPayload: UserPayload | undefined;
}

@Injectable()
export class CurrentUserPayloadInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtTokenExtractor: JwtTokenExtractor,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<UserPayloadRequest>();
    const jwtToken = this.jwtTokenExtractor.extractJwtToken(request.headers);

    if (jwtToken) {
      request.userPayload = await this.jwtHelper.getUserPayload(jwtToken);
    }

    return next.handle();
  }
}
