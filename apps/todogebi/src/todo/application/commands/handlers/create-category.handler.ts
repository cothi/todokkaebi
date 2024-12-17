import { CreateCategoryCommand } from '@/todo/application/commands/create-category.command';
import { CategoryService } from '@/todo/application/services/category.service';
import { ProjectService } from '@/todo/application/services/project.serivce';
import { CategoryResponse } from '@/todo/presentation/resolvers/dto/objects/category-response.object';
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@Injectable()
@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(
    private readonly categoryService: CategoryService,
    private readonly projectService: ProjectService,
  ) {}
  async execute(command: CreateCategoryCommand): Promise<CategoryResponse> {
    try {
      await this.projectService.validateProjectOwnerWithUserId(
        command.projectId,
        command.userId,
      );
      const category = await this.categoryService.createCategory(command);
      return {
        success: true,
        category,
      };
    } catch (e) {
      throw e;
    }
  }
}
