import { Field, InputType } from '@nestjs/graphql';
import { TaskState } from '@prisma/client';

@InputType()
export class GetAllCategoriesInput {
  @Field()
  projectId: string;

  @Field({ defaultValue: TaskState.PENDING })
  state?: TaskState;
}
