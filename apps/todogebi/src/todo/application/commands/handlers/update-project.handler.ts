import { UpdateProjectCommand } from '@/todo/application/commands/update-project.command';
import { ProjectService } from '@/todo/application/services/project.serivce';
import { ProjectResponseObject } from '@/todo/presentation/resolvers/dto/objects/project-response.object';
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@Injectable()
@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler
  implements ICommandHandler<UpdateProjectCommand>
{
  constructor(private readonly projectService: ProjectService) {}
  async execute(command: UpdateProjectCommand): Promise<ProjectResponseObject> {
    try {
      await this.projectService.validateProjectOwnerWithUserId(
        command.id,
        command.userId,
      );
      const project = await this.projectService.updateProject(command);

      return {
        success: true,
        project,
      };
    } catch (e) {
      throw e;
    }
  }
}
