import { ProjectModel } from '@/todo/domain/model/project.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectResponseObject {
  @Field()
  success: boolean;

  @Field(() => ProjectModel)
  project: ProjectModel;
}
