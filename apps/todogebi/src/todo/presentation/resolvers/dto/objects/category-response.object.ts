import { CategoryModel } from '@/todo/domain/model/category.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryResponse {
  @Field()
  success: boolean;

  @Field(() => CategoryModel)
  category: CategoryModel;
}
