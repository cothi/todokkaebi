import { GetProjectQuery } from '@/todo/application/queries/get-project.query';
import { CategoryService } from '@/todo/application/services/category.service';
import { ProjectService } from '@/todo/application/services/project.serivce';
import { ProjectResponseObject } from '@/todo/presentation/resolvers/dto/objects/project-response.object';
import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@Injectable()
@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery> {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly projectService: ProjectService,
  ) {}
  async execute(query: GetProjectQuery): Promise<ProjectResponseObject> {
    try {
      const project = await this.projectService.getProjectWithId(query);
      project.categories = await this.categoryService.insertsDate(
        project.categories,
      );

      project.categories =
        await this.categoryService.insertCategoriesTotalAndCompleteTaskCount(
          project.categories,
        );

      return {
        success: true,
        project,
      };
    } catch (e) {
      throw e;
    }
  }
}
