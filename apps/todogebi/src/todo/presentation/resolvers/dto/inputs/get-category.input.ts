import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetCategoryInput {
  @Field()
  id: string;
}
