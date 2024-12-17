import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Task, TaskState } from '@prisma/client';

@ObjectType()
export class TaskModel implements Task {
  @Field(() => ID)
  id: string;

  @Field(() => Date, { nullable: true })
  actualStartDate: Date | null;

  @Field(() => Date, { nullable: true })
  actualEndDate: Date | null;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  title: string;

  @Field()
  check: boolean;

  @Field()
  status: TaskState;

  @Field()
  categoryId: string;

  @HideField()
  createdAt: Date;

  @HideField()
  updatedAt: Date;

  @Field({ defaultValue: 0 })
  totalProjectTask?: number;

  @Field({ defaultValue: 0 })
  completeProjectTask?: number;
}
