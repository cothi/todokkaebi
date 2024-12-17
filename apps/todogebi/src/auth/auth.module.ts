import { Module } from '@nestjs/common';
import { JwtTokenModule } from '@libs/jwt';
import { UserAuthResolver } from '@src/auth/presentation/resolver/user-auth.resolver';
import { KakaoAuthResolver } from '@src/auth/presentation/resolver/kakao-auth.resolver';
import { KakaoLoginUrlHandler } from '@src/auth/application/queries/handlers/kakao-login-url.handler';
import { KakaoAuthHandler } from '@src/auth/application/commands/handlers/kakao-auth.handler';
import { CreateUserHandler } from '@src/auth/application/commands/handlers/create-user.handler';
import { UpdateUserInfoHandler } from '@src/auth/application/commands/handlers/update-user-info.handler';
import { GetUserInfoHandler } from '@src/auth/application/queries/handlers/get-user-info.handler';
import { DeleteUserHandler } from '@src/auth/application/commands/handlers/delete-user.handler';
import { ReissueAccessTokenHandler } from '@src/auth/application/commands/handlers/reissue-access-token.handler';
import { KakaoAuthService } from '@src/auth/application/services/kakao-auth.service';
import { UserAuthService } from '@src/auth/application/services/user-auth.service';
import { UserRepository } from '@src/auth/infrastructure/database/repository/user.repository';
import { KakaoModule } from '@src/auth/infrastructure/kakao/kakao.moduel';
import { DatabaseModule } from '@libs/database';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [JwtTokenModule, DatabaseModule, KakaoModule, CqrsModule],
  providers: [
    UserAuthResolver,
    KakaoAuthResolver,

    KakaoLoginUrlHandler,
    KakaoAuthHandler,
    CreateUserHandler,
    UpdateUserInfoHandler,
    GetUserInfoHandler,
    DeleteUserHandler,
    ReissueAccessTokenHandler,

    KakaoAuthService,
    UserAuthService,

    UserRepository,
  ],
})
export class AuthModule {}
