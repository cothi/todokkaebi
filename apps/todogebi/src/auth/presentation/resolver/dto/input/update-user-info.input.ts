import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsEmail, MaxLength, MinLength } from 'class-validator';

@InputType({
  description: '유저 정보를 업데이트하기 위한 필드',
})
export class UpdateUserInfoInput {
  @Field(() => String, { nullable: true })
  @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
  @MaxLength(30, { message: '닉네임은 최대 30자까지 가능합니다.' })
  nickname: string;

  @Field(() => String, { nullable: true })
  @IsDate({ message: '유효한 날짜여야 합니다.' })
  birthday: string;

  @Field(() => String, { nullable: true })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;
}
