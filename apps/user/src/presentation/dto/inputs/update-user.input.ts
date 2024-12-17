import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  nickname: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  email: string;
}
