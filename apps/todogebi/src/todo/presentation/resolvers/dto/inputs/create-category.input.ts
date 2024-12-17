import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field()
  projectId: string;

  @Field()
  name: string;
}
