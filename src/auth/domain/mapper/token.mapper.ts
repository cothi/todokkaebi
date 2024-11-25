import { Tokens } from '@prisma/client';
import { TokenModel } from '@src/auth/domain/models/token.modell';

export class TokenMapper {
  static prismaTokenToDomain(data: Tokens): TokenModel {
    return TokenModel.create({
      accessToken: data.accessToken,
      createdAt: data.createdAt,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
      userId: data.userId,
      isRevoked: data.isRevoked,
      id: data.id,
    });
  }
}
