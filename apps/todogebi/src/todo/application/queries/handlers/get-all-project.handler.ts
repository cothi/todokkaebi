import { GetAllProjectsQuery } from '@/todo/application/queries/get-all-projects.query';
import { CategoryService } from '@/todo/application/services/category.service';
import { ProjectService } from '@/todo/application/services/project.serivce';
import { GetAllProjectsResponse } from '@/todo/presentation/resolvers/dto/objects/get-all-projects.object';
import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@Injectable()
@QueryHandler(GetAllProjectsQuery)
export class GetAllProjectHandler
  implements IQueryHandler<GetAllProjectsQuery>
{
  constructor(
    private readonly categoryService: CategoryService,
    private readonly projectService: ProjectService,
  ) {}
  async execute(query: GetAllProjectsQuery): Promise<GetAllProjectsResponse> {
    try {
      const projects = await this.projectService.getProjectsWithUserId(
        query.userId,
      );
      const insertsDateProjects =
        await this.categoryService.insertsDateWithProjects(projects);
      return {
        success: true,
        total: projects.length,
        projects: insertsDateProjects,
      };
    } catch (e) {
      throw e;
    }
  }
}
