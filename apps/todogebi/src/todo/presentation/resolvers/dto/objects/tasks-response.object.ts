import { TaskModel } from '@/todo/domain/model/task.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TasksResponse {
  @Field()
  success: boolean;

  @Field()
  total: number;

  @Field()
  tasks: TaskModel[];
}
