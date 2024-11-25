import { Prisma } from '@prisma/client';
import { TokenModel } from '@src/auth/domain/models/token.modell';

export const TokenRepositorySymbol = Symbol.for('TokenRepository');

// 공통적인 메서드 정의를 위한 기본 인터페이스
export interface IRefreshRepository {
  updateToken: unknown;
  findToken: unknown;
  storeToken: unknown;
}

// Prisma를 사용하는 UserRepository 인터페이스
export type PrismaTokenRepositoryArgs = {
  updateToken: Prisma.TokensUpdateArgs;
  findToken: Prisma.TokensFindFirstArgs;
  createToken: Prisma.TokensCreateArgs;
};

// 제너릭을 활용한 유연한 UserRepository 인터페이스
export interface ITokensRepositoryGeneric<T extends Record<string, any>> {
  updateToken(data: T['updateToken']): Promise<TokenModel>;
  findToken(data: T['findToken']): Promise<TokenModel | null>;
  createToken(data: T['createToken']): Promise<TokenModel>;
}
