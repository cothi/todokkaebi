import { UpdateTaskCommand } from '@/todo/application/commands/update-task.command';
import { ProjectService } from '@/todo/application/services/project.serivce';
import { TaskService } from '@/todo/application/services/task.service';
import { TaskResponse } from '@/todo/presentation/resolvers/dto/objects/task-response.object';
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@Injectable()
@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<TaskResponse> {
    try {
      await this.taskService.validateTaskWithUserId(command.id, command.userId);
      await this.projectService.validateProjectOwnerWithUserId(
        command.projectId,
        command.userId,
      );

      const task = await this.taskService.updateTask(command);
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
