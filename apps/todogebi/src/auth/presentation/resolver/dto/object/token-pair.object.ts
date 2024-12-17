import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenPair {
  @Field(() => String, { description: '액세스 토큰, 유효기간 30분' })
  accessToken: string;

  @Field(() => String, {
    description:
      '리프레시 토큰, 액세스 토큰을 재발급 받는데 사용, 유효기간 3일',
  })
  refreshToken: string;
}
