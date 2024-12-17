import { CategoryModel } from '@/todo/domain/model/category.model';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Project } from '@prisma/client';

@ObjectType()
export class ProjectModel implements Project {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  userId: string;

  @Field({ defaultValue: 0 })
  totalTask?: number;

  @Field({ defaultValue: 0 })
  completeTask?: number;

  @HideField()
  createdAt: Date;

  @HideField()
  updatedAt: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  startDate?: Date;

  @Field(() => [CategoryModel], { nullable: true })
  categories?: CategoryModel[];
}
