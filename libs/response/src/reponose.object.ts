import { ObjectType, Field, Int } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';

@ObjectType({
  description:
    'A generic response object that includes status, message, and data.',
})
export class ApiResponse<T> {
  @Field(() => Int, { description: 'HTTP status code of the response.' })
  status: HttpStatus;

  @Field({
    nullable: true,
    description: 'An optional message detailing the response.',
  })
  message?: string;

  @Field({
    nullable: true,
    description: 'The data payload for successful responses.',
  })
  data?: T;
}
