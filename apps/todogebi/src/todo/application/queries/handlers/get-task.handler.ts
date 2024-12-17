import { GetTaskQuery } from '@/todo/application/queries/get-task.query';
import { TaskService } from '@/todo/application/services/task.service';
import { TaskResponse } from '@/todo/presentation/resolvers/dto/objects/task-response.object';
import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@Injectable()
@QueryHandler(GetTaskQuery)
export class GetTaskHandler implements IQueryHandler<GetTaskQuery> {
  constructor(private readonly taskService: TaskService) {}
  async execute(query: GetTaskQuery): Promise<TaskResponse> {
    try {
      await this.taskService.validateTaskWithUserId(query.id, query.userId);
      const task = await this.taskService.getTaskWithTaskId(query.id);
      return {
        success: true,
        task,
      };
    } catch (e) {
      throw e;
    }
  }
}
