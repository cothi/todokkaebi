import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetKakaoLoginUrlInput {
  @Field()
  test: boolean;
}
