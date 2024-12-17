import { CreateProjectCommand } from '@/todo/application/commands/create-project.command';
import { DeleteProjectCommand } from '@/todo/application/commands/delete-project.command';
import { UpdateProjectCommand } from '@/todo/application/commands/update-project.command';
import { GetProjectQuery } from '@/todo/application/queries/get-project.query';
import { ProjectModel } from '@/todo/domain/model/project.model';
import { TaskModel } from '@/todo/domain/model/task.model';
import { ProjectRepository } from '@/todo/infrastructure/database/repository/project.repository';
import { ErrorCode } from '@/utils/exception/error-code.enum';
import { errorFactory } from '@/utils/exception/error-factory.exception';
import { Injectable } from '@nestjs/common';
import { TaskState } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async getProjectWithId(query: GetProjectQuery): Promise<ProjectModel> {
    let project;
    if (query.status === TaskState.IN_PROGRESS) {
      project = await this.projectRepository.getProjectWithIdAndNotStatus(
        query.id,
        TaskState.PENDING,
      );
    } else {
      project = await this.projectRepository.getProjectWithIdAndStatus(
        query.id,
        query.status,
      );
    }
    if (!project) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }
    const projectWithRange = await this.getProjectRange(project);
    projectWithRange.totalTask = await this.countProjectTaskCounts(query.id);
    projectWithRange.completeTask = await this.countProjectCompleteTask(
      query.id,
    );
    return projectWithRange;
  }

  async getProjectsWithUserId(userId: string): Promise<ProjectModel[]> {
    const projects = await this.projectRepository.getProjectsWithUserId(userId);
    const promise1 = projects.map(project => this.getProjectRange(project));

    const insertDatesProjects = await Promise.all(promise1);
    const promise2 = insertDatesProjects.map(project =>
      this.insertCountProjectCompleteTasks(project),
    );
    return await Promise.all(promise2);
  }

  async createProject(cmd: CreateProjectCommand): Promise<ProjectModel> {
    const project = await this.projectRepository.createProject({
      name: cmd.name,
      user: {
        connect: {
          id: cmd.userId,
        },
      },
    });

    return project;
  }

  async updateProject(cmd: UpdateProjectCommand): Promise<ProjectModel> {
    const project = await this.projectRepository.updateProject(cmd.id, {
      ...cmd,
    });
    const insertDate = await this.getProjectRange(project);
    return await this.insertCountProjectCompleteTasks(insertDate);
  }

  async deleteProject(cmd: DeleteProjectCommand): Promise<ProjectModel> {
    return await this.projectRepository.deleteProject(cmd.id);
  }

  async validateProjectOwnerWithUserId(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const project = await this.projectRepository.getOnlyProject(projectId);
    if (!project) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }

    if (project.userId !== userId) {
      throw errorFactory(ErrorCode.UNAUTHORIZED);
    }
  }
  async insertTaskCountWithTaskModel(
    model: TaskModel,
    projectId: string,
  ): Promise<TaskModel> {
    model.totalProjectTask = await this.countProjectTaskCounts(projectId);
    model.completeProjectTask = await this.countProjectCompleteTask(projectId);
    return model;
  }

  async countProjectTaskCounts(projectId: string): Promise<number> {
    return await this.projectRepository.countProjectTasks(projectId);
  }

  async countProjectCompleteTask(projectId: string): Promise<number> {
    return await this.projectRepository.countProjectCompleteTasks(projectId);
  }
  private async getProjectRange(
    projectModel: ProjectModel,
  ): Promise<ProjectModel> {
    const range = await this.projectRepository.getProjectRange(projectModel.id);
    if (range.startDate) projectModel.startDate = range.startDate;
    if (range.endDate) projectModel.endDate = range.endDate;
    return projectModel;
  }

  private async insertCountProjectCompleteTasks(
    project: ProjectModel,
  ): Promise<ProjectModel> {
    project.completeTask = await this.countProjectCompleteTask(project.id);
    project.totalTask = await this.countProjectTaskCounts(project.id);
    return project;
  }
}
