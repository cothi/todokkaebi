import { Inject, Injectable } from '@nestjs/common';
import {
  ITokensRepositoryGeneric,
  PrismaTokenRepositoryArgs,
  TokenRepositorySymbol,
} from '@src/auth/domain/interface/token-repository.interface';
import {
  IUserRepositoryGeneric,
  PrismaUserRepositoryArgs,
  UserRepositorySymbol,
} from '@src/user/domain/interface/user-repository.interface';
import { ErrorCode, errorFactory } from '@libs/exception';

@Injectable()
export class UserAuthService {
  constructor(
    @Inject(TokenRepositorySymbol)
    private readonly tokenRepository: ITokensRepositoryGeneric<PrismaTokenRepositoryArgs>,

    @Inject(UserRepositorySymbol)
    private readonly userRepository: IUserRepositoryGeneric<PrismaUserRepositoryArgs>,
  ) {}
  async authenticate(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findUser({
      where: {
        email,
      },
    });
    if (!user) {
      throw errorFactory(ErrorCode.UNAUTHORIZED);
    }

    if (password !== user.password) {
      throw errorFactory(ErrorCode.UNAUTHORIZED);
    }
    return true;
  }
  async refreshToken(accessToken: string, refreshToken: string): Promise<void> {
    const token = await this.tokenRepository.updateToken({
      where: {
        refreshToken,
      },
      data: {
        accessToken,
      },
    });
    if (token.accessToken !== accessToken) {
      throw errorFactory(ErrorCode.INVALID_INPUT);
    }
  }
  async logout(accessToken: string): Promise<void> {
    const token = await this.tokenRepository.updateToken({
      where: {
        accessToken,
      },
      data: {
        isRevoked: false,
      },
    });

    if (!token.isRevoked) {
      throw errorFactory(ErrorCode.INVALID_INPUT);
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<void> {
    const token = await this.tokenRepository.findToken({
      where: {
        refreshToken,
      },
    });
    if (!token || token.isRevoked) {
      throw errorFactory(ErrorCode.INVALID_TOKEN);
    }
  }

  async validateAccessToken(accessToken: string): Promise<void> {
    const token = await this.tokenRepository.findToken({
      where: {
        accessToken,
      },
    });
    if (!token || token.isRevoked) {
      throw errorFactory(ErrorCode.INVALID_TOKEN);
    }
  }
}
