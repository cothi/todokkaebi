import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@InputType({
  description: '카카오 토큰 발급 위한 Code',
})
export class KakaoAuthCodeInput {
  @Field(() => String, {
    description:
      '카카오 로그인 후 받은 인증 코드, 서비스의 회원 가입 또는 로그인에 사용',
  })
  @IsString()
  code: string;

  @Field()
  @IsBoolean()
  test: boolean;
}
