import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCategoryInput {
  @Field()
  categoryId: string;
}
