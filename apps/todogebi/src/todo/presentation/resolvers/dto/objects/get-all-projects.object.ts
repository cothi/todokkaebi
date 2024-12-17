import { ProjectModel } from '@/todo/domain/model/project.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetAllProjectsResponse {
  @Field()
  success: boolean;

  @Field()
  total: number;

  @Field(() => [ProjectModel])
  projects: ProjectModel[];
}
