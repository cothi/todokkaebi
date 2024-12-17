import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteUser {
  @Field()
  success: boolean;
}
