import { TaskModel } from '@/todo/domain/model/task.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TaskResponse {
  @Field()
  success: boolean;

  @Field()
  task: TaskModel;
}
