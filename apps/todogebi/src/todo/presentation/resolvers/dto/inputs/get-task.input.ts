import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetTaskInput {
  @Field()
  taskId: string;

  @Field()
  projectId: string;
}
