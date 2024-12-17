import { Injectable } from '@nestjs/common';

import { PrismaService } from '@libs/database';
import {
  ITokensRepositoryGeneric,
  PrismaTokenRepositoryArgs,
} from '@src/auth/domain/interface/token-repository.interface';
import { TokenModel } from '@src/auth/domain/models/token.modell';
import { TokenMapper } from '@src/auth/domain/mapper/token.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class TokenRepository
  implements ITokensRepositoryGeneric<PrismaTokenRepositoryArgs>
{
  constructor(private readonly prisma: PrismaService) {}

  async updateToken(data: Prisma.TokensUpdateArgs): Promise<TokenModel> {
    const token = await this.prisma.tokens.update(data);
    return TokenMapper.prismaTokenToDomain(token);
  }

  async createToken(data: Prisma.TokensCreateArgs): Promise<TokenModel> {
    const token = await this.prisma.tokens.create(data);
    return TokenMapper.prismaTokenToDomain(token);
  }

  async findToken(
    data: Prisma.TokensFindFirstArgs,
  ): Promise<TokenModel | null> {
    const token = await this.prisma.tokens.findFirst(data);
    if (!token) {
      return null;
    }
    return TokenMapper.prismaTokenToDomain(token);
  }
}
