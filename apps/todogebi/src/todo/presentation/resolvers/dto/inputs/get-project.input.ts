import { Field, InputType } from '@nestjs/graphql';
import { TaskState } from '@prisma/client';

@InputType()
export class GetProjectInput {
  @Field()
  id: string;

  @Field({ defaultValue: TaskState.PENDING, nullable: true })
  state: TaskState;
}
