import { CreateTaskCommand } from '@/todo/application/commands/create-task.command';
import { CategoryService } from '@/todo/application/services/category.service';
import { ProjectService } from '@/todo/application/services/project.serivce';
import { TaskService } from '@/todo/application/services/task.service';
import { TaskResponse } from '@/todo/presentation/resolvers/dto/objects/task-response.object';
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@Injectable()
@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
  ) {}
  async execute(command: CreateTaskCommand): Promise<TaskResponse> {
    try {
      await this.categoryService.validateUserId(
        command.userId,
        command.categoryId,
      );
      const task = await this.taskService.createTask(command);

      const insertCountTask =
        await this.projectService.insertTaskCountWithTaskModel(
          task,
          command.projectId,
        );
      return {
        success: true,
        task: insertCountTask,
      };
    } catch (e) {
      throw e;
    }
  }
}
