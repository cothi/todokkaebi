import { Tokens } from '@prisma/client';
import { Field } from '@nestjs/graphql';

export class TokenModel implements Tokens {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  isRevoked: boolean;

  @Field()
  createdAt: Date;

  @Field()
  expiresAt: Date;

  constructor(data: Partial<TokenModel>) {
    Object.assign(data);
  }

  static create(data: Partial<TokenModel>): TokenModel {
    return new TokenModel(data);
  }
}
