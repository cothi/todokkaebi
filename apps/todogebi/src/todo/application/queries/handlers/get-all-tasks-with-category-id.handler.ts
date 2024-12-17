import { GetAllTasksWithCategoryIdQuery } from '@/todo/application/queries/get-all-tasks-with-categoryId.query';
import { CategoryService } from '@/todo/application/services/category.service';
import { TaskService } from '@/todo/application/services/task.service';
import { TasksResponse } from '@/todo/presentation/resolvers/dto/objects/tasks-response.object';
import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@Injectable()
@QueryHandler(GetAllTasksWithCategoryIdQuery)
export class GetAllTasksWithCategoryIdHandler
  implements IQueryHandler<GetAllTasksWithCategoryIdQuery>
{
  constructor(
    private readonly categoryService: CategoryService,
    private readonly taskService: TaskService,
  ) {}
  async execute(query: GetAllTasksWithCategoryIdQuery): Promise<TasksResponse> {
    try {
      await this.categoryService.validateUserId(query.userId, query.categoryId);
      const tasks = await this.taskService.getAllTasksWithCategoryId(
        query.categoryId,
      );
      return {
        success: true,
        tasks,
        total: tasks.length,
      };
    } catch (e) {
      throw e;
    }
  }
}
