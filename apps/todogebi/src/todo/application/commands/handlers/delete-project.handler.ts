import { DeleteProjectCommand } from '@/todo/application/commands/delete-project.command';
import { ProjectService } from '@/todo/application/services/project.serivce';
import { ProjectResponseObject } from '@/todo/presentation/resolvers/dto/objects/project-response.object';
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@Injectable()
@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler
  implements ICommandHandler<DeleteProjectCommand>
{
  constructor(private readonly projectService: ProjectService) {}
  async execute(command: DeleteProjectCommand): Promise<ProjectResponseObject> {
    try {
      await this.projectService.validateProjectOwnerWithUserId(
        command.id,
        command.userId,
      );
      const project = await this.projectService.deleteProject(command);

      return {
        success: true,
        project,
      };
    } catch (e) {
      throw e;
    }
  }
}
