import { TaskModel } from '@/todo/domain/model/task.model';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Category, TaskState } from '@prisma/client';

@ObjectType()
export class CategoryModel implements Category {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  projectId: string;

  @HideField()
  createdAt: Date;

  @HideField()
  updatedAt: Date;

  @Field({ nullable: true })
  actualEndDate?: Date;

  @Field({ nullable: true })
  actualStartDate?: Date;

  @Field({ nullable: true })
  startedAt?: Date;

  @Field({ nullable: true })
  endedAt?: Date;

  @Field(() => [TaskModel], { nullable: true })
  tasks?: TaskModel[];

  @Field({ defaultValue: 0 })
  totalTask?: number;

  @Field({ defaultValue: 0 })
  completeTask?: number;
}
