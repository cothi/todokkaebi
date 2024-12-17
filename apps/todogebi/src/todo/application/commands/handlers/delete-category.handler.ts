import { DeleteCategoryCommand } from '@/todo/application/commands/delete-category.command';
import { CategoryService } from '@/todo/application/services/category.service';
import { CategoryResponse } from '@/todo/presentation/resolvers/dto/objects/category-response.object';
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@Injectable()
@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(private readonly categoryService: CategoryService) {}
  async execute(command: DeleteCategoryCommand): Promise<CategoryResponse> {
    try {
      await this.categoryService.validateUserId(
        command.userId,
        command.categoryId,
      );
      const category = await this.categoryService.deleteCategory(command);
      return {
        success: true,
        category,
      };
    } catch (e) {
      throw e;
    }
  }
}
