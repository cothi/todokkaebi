import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput {
  @Field()
  categoryId: string;

  @Field()
  categoryName: string;
}
