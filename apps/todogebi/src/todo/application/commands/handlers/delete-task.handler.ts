import { DeleteTaskCommand } from '@/todo/application/commands/delete-task.command';
import { ProjectService } from '@/todo/application/services/project.serivce';
import { TaskService } from '@/todo/application/services/task.service';
import { TaskResponse } from '@/todo/presentation/resolvers/dto/objects/task-response.object';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
  ) {}
  async execute(command: DeleteTaskCommand): Promise<TaskResponse> {
    try {
      await this.taskService.validateTaskWithUserId(command.id, command.userId);

      const task = await this.taskService.deleteTask(command);

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
