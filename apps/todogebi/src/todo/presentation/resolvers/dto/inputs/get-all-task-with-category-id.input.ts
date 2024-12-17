import { Field, InputType } from '@nestjs/graphql';
import { TaskState } from '@prisma/client';

@InputType()
export class GetAllTaskWithCategoryIdInput {
  @Field()
  categoryId: string;
}
