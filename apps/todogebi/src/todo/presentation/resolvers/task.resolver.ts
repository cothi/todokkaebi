import { CreateTaskCommand } from '@/todo/application/commands/create-task.command';
import { DeleteTaskCommand } from '@/todo/application/commands/delete-task.command';
import { UpdateTaskCommand } from '@/todo/application/commands/update-task.command';
import { GetAllTasksWithCategoryIdQuery } from '@/todo/application/queries/get-all-tasks-with-categoryId.query';
import { GetTaskQuery } from '@/todo/application/queries/get-task.query';
import { TaskModel } from '@/todo/domain/model/task.model';
import { CreateTaskInput } from '@/todo/presentation/resolvers/dto/inputs/create-task.input';
import { DeleteTaskInput } from '@/todo/presentation/resolvers/dto/inputs/delete-task.input';
import { GetAllTaskWithCategoryIdInput } from '@/todo/presentation/resolvers/dto/inputs/get-all-task-with-category-id.input';
import { GetTaskInput } from '@/todo/presentation/resolvers/dto/inputs/get-task.input';
import { UpdateTaskInput } from '@/todo/presentation/resolvers/dto/inputs/update-task.input';
import { TaskResponse } from '@/todo/presentation/resolvers/dto/objects/task-response.object';
import { TokenInfo } from '@/utils/decorators/token-info.decorator';
import { JwtAuthGuard } from '@/utils/guard/jwt-auth.guard';
import { JwtPayload } from '@/utils/jwt/jwt-token.interface';
import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

@Resolver(() => TaskModel)
export class TaskResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Mutation(() => TaskResponse)
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Args('input') input: CreateTaskInput,
    @TokenInfo() payload: JwtPayload,
  ) {
    const command = new CreateTaskCommand(
      payload.userId,
      input.title,
      input.startDate,
      input.endDate,
      input.categoryId,
      input.projectId,
    );
    return await this.commandBus.execute(command);
  }

  @Mutation(() => TaskResponse)
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Args('input') input: UpdateTaskInput,
    @TokenInfo() payload: JwtPayload,
  ) {
    const command = new UpdateTaskCommand(
      payload.userId,
      input.taskId,
      input.projectId,
      input.title,
      input.startDate,
      input.endDate,
      input.check,
    );
    return await this.commandBus.execute(command);
  }

  @Mutation(() => TaskResponse)
  @UseGuards(JwtAuthGuard)
  async deleteTask(
    @Args('input') input: DeleteTaskInput,
    @TokenInfo() payload: JwtPayload,
  ) {
    const command = new DeleteTaskCommand(
      payload.userId,
      input.taskId,
      input.projectId,
    );
    return await this.commandBus.execute(command);
  }

  @Query(() => TaskResponse)
  @UseGuards(JwtAuthGuard)
  async getTask(
    @Args('input') input: GetTaskInput,
    @TokenInfo() payload: JwtPayload,
  ) {
    const query = new GetTaskQuery(
      payload.userId,
      input.taskId,
      input.projectId,
    );
    return await this.queryBus.execute(query);
  }

  @Query(() => TaskResponse)
  @UseGuards(JwtAuthGuard)
  async getTasksWithCategoryId(
    @Args('input') input: GetAllTaskWithCategoryIdInput,
    @TokenInfo() payload: JwtPayload,
  ) {
    const query = new GetAllTasksWithCategoryIdQuery(
      payload.userId,
      input.categoryId,
    );
    return await this.queryBus.execute(query);
  }
}
