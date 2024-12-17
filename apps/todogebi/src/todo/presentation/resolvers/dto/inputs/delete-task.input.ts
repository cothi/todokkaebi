import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteTaskInput {
  @Field()
  taskId: string;

  @Field()
  projectId: string;
}
