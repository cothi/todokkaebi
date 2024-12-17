import { ProjectMapper } from '@/todo/domain/mapper/project.mapper';
import { ProjectModel } from '@/todo/domain/model/project.model';
import { PrismaService } from '@/todo/infrastructure/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, TaskState } from '@prisma/client';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
@Injectable()
export class ProjectRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getProjectsWithUserId(userId: string): Promise<ProjectModel[]> {
    const projects = await this.prismaService.project.findMany({
      where: {
        userId,
      },
    });
    return ProjectMapper.toDomains(projects);
  }
  async getProjectWithIdAndStatus(
    id: string,
    status: TaskState,
  ): Promise<ProjectModel | null> {
    const project = await this.prismaService.project.findUnique({
      where: {
        id: id,
      },
      include: {
        categories: {
          include: {
            tasks: {
              where: {
                status,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    return ProjectMapper.ProjectCategoryTaskToDomains(project);
  }

  async getProjectWithIdAndNotStatus(
    id: string,
    status: TaskState,
  ): Promise<ProjectModel | null> {
    const project = await this.prismaService.project.findUnique({
      where: {
        id: id,
      },
      include: {
        categories: {
          include: {
            tasks: {
              where: {
                status: {
                  not: status,
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    return ProjectMapper.ProjectCategoryTaskToDomains(project);
  }

  async getOnlyProject(id: string): Promise<ProjectModel | null> {
    const project = await this.prismaService.project.findUnique({
      where: {
        id: id,
      },
    });

    if (!project) {
      return null;
    }

    return ProjectMapper.toDomain(project);
  }

  async createProject(data: Prisma.ProjectCreateInput): Promise<ProjectModel> {
    const project = await this.prismaService.project.create({ data });
    return ProjectMapper.toDomain(project);
  }

  async updateProject(
    projectId: string,
    data: Prisma.ProjectUpdateInput,
  ): Promise<ProjectModel> {
    const project = await this.prismaService.project.update({
      where: {
        id: projectId,
      },
      include: {
        categories: {
          include: {
            tasks: true,
          },
        },
      },
      data,
    });
    return ProjectMapper.ProjectCategoryTaskToDomains(project);
  }

  async deleteProject(id: string): Promise<ProjectModel> {
    const project = await this.prismaService.project.delete({
      where: {
        id,
      },
    });
    return ProjectMapper.toDomain(project);
  }

  async countProjectTasks(projectId: string): Promise<number> {
    const counts = await this.prismaService.task.count({
      where: {
        Category: {
          projectId: projectId,
        },
      },
    });
    return counts;
  }
  async countProjectCompleteTasks(projectId: string): Promise<number> {
    const counts = await this.prismaService.task.count({
      where: {
        check: true,
        Category: {
          projectId: projectId,
        },
      },
    });
    return counts;
  }

  async getProjectRange(projectId: string): Promise<{
    projectId: string;
    startDate: Date | null;
    endDate: Date | null;
  }> {
    const duration = await this.prismaService.task.aggregate({
      _min: {
        startDate: true,
      },
      _max: {
        endDate: true,
      },
      where: {
        Category: {
          Project: {
            id: projectId,
          },
        },
      },
    });

    return {
      projectId,
      startDate: duration._min.startDate,
      endDate: duration._max.endDate,
    };
  }
}
