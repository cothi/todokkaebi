import { ProjectModel } from '@/todo/domain/model/project.model';
import { Prisma, Project } from '@prisma/client';

type ProjectWithCategoriesAndTasks = Prisma.ProjectGetPayload<{
  include: {
    categories: {
      include: {
        tasks: true;
      };
    };
  };
}>;
export class ProjectMapper {
  static toDomain(project: Project): ProjectModel {
    return {
      ...project,
    };
  }
  static toDomains(projects: Project[]): ProjectModel[] {
    return projects.map(project => this.toDomain(project));
  }

  static ProjectCategoryTaskToDomains(
    payload: ProjectWithCategoriesAndTasks,
  ): ProjectModel {
    return {
      id: payload.id,
      name: payload.name,
      userId: payload.userId,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
      categories: payload.categories.map(category => ({
        id: category.id,
        name: category.name,
        projectId: category.projectId,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        tasks: category.tasks.map(task => ({
          id: task.id,
          title: task.title,
          startDate: task.startDate,
          endDate: task.endDate,
          status: task.status,
          actualStartDate: task.actualStartDate,
          actualEndDate: task.actualEndDate,
          check: task.check,
          categoryId: task.categoryId,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })),
      })),
    };
  }
}
