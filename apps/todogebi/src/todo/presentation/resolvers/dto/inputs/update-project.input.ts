import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProjectInput {
  @Field()
  projectId: string;

  @Field({ nullable: true })
  name: string;
}
