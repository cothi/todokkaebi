import { CreateProjectCommand } from '@/todo/application/commands/create-project.command';
import { DeleteProjectCommand } from '@/todo/application/commands/delete-project.command';
import { UpdateProjectCommand } from '@/todo/application/commands/update-project.command';
import { GetAllProjectsQuery } from '@/todo/application/queries/get-all-projects.query';
import { GetProjectQuery } from '@/todo/application/queries/get-project.query';
import { CreateProjectInput } from '@/todo/presentation/resolvers/dto/inputs/create-project.input';
import { DeleteProjectInput } from '@/todo/presentation/resolvers/dto/inputs/delete-project.input';
import { GetProjectInput } from '@/todo/presentation/resolvers/dto/inputs/get-project.input';
import { UpdateProjectInput } from '@/todo/presentation/resolvers/dto/inputs/update-project.input';
import { GetAllProjectsResponse } from '@/todo/presentation/resolvers/dto/objects/get-all-projects.object';
import { ProjectResponseObject } from '@/todo/presentation/resolvers/dto/objects/project-response.object';
import { TokenInfo } from '@/utils/decorators/token-info.decorator';
import { JwtAuthGuard } from '@/utils/guard/jwt-auth.guard';
import { JwtPayload } from '@/utils/jwt/jwt-token.interface';
import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => ProjectResponseObject)
export class ProjectResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Mutation(() => ProjectResponseObject)
  async createProject(
    @Args('input') input: CreateProjectInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<ProjectResponseObject> {
    const command = new CreateProjectCommand(payload.userId, input.name);
    return await this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => ProjectResponseObject)
  async getProject(
    @Args('input') input: GetProjectInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<ProjectResponseObject> {
    const query = new GetProjectQuery(payload.userId, input.id, input.state);
    return await this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => GetAllProjectsResponse)
  async getAllProjects(
    @TokenInfo() payload: JwtPayload,
  ): Promise<GetAllProjectsResponse> {
    const query = new GetAllProjectsQuery(payload.userId);
    return await this.queryBus.execute(query);
  }

  @Mutation(() => ProjectResponseObject)
  @UseGuards(JwtAuthGuard)
  async deleteProject(
    @Args('input') input: DeleteProjectInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<ProjectResponseObject> {
    const command = new DeleteProjectCommand(payload.userId, input.projectId);
    return await this.commandBus.execute(command);
  }

  @Mutation(() => ProjectResponseObject)
  @UseGuards(JwtAuthGuard)
  async updateProject(
    @Args('input') input: UpdateProjectInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<ProjectResponseObject> {
    const command = new UpdateProjectCommand(
      payload.userId,
      input.projectId,
      input.name,
    );

    return await this.commandBus.execute(command);
  }
}
