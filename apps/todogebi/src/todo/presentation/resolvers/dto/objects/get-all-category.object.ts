import { CategoryModel } from '@/todo/domain/model/category.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetAllCategoryResponse {
  @Field()
  success: boolean;

  @Field()
  total: number;

  @Field(() => [CategoryModel])
  categories: CategoryModel[];
}
