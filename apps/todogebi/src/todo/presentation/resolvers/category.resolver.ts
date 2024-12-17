import { CreateCategoryCommand } from '@/todo/application/commands/create-category.command';
import { DeleteCategoryCommand } from '@/todo/application/commands/delete-category.command';
import { UpdateCategoryCommand } from '@/todo/application/commands/update-category.command';
import { GetCategoryQuery } from '@/todo/application/queries/get-category.query';
import { CreateCategoryInput } from '@/todo/presentation/resolvers/dto/inputs/create-category.input';
import { DeleteCategoryInput } from '@/todo/presentation/resolvers/dto/inputs/delete-category.input';
import { GetCategoryInput } from '@/todo/presentation/resolvers/dto/inputs/get-category.input';
import { UpdateCategoryInput } from '@/todo/presentation/resolvers/dto/inputs/update-category.input';
import { CategoryResponse } from '@/todo/presentation/resolvers/dto/objects/category-response.object';
import { TokenInfo } from '@/utils/decorators/token-info.decorator';
import { JwtAuthGuard } from '@/utils/guard/jwt-auth.guard';
import { JwtPayload } from '@/utils/jwt/jwt-token.interface';
import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class CategoryResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Mutation(() => CategoryResponse)
  async createCategory(
    @Args('input') input: CreateCategoryInput,
    @TokenInfo() payload: JwtPayload,
  ) {
    const command = new CreateCategoryCommand(
      payload.userId,
      input.projectId,
      input.name,
    );

    return await this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => CategoryResponse)
  async getCategory(
    @Args('input') input: GetCategoryInput,
    @TokenInfo() payload: JwtPayload,
  ) {
    const query = new GetCategoryQuery(input.id, payload.userId);
    return await this.queryBus.execute(query);
  }
  /*  @UseGuards(JwtAuthGuard)
  @Mutation(() => GetAllCategoryResponse)
  async getAllCategories(
    @Args('input') input: GetAllCategoriesInput,
    @TokenInfo() payload: JwtPayload,
  ) {
    const query = new GetAllCategoriesQuery(payload.userId, input.projectId);
    return await this.queryBus.execute(query);
  }
*/
  @UseGuards(JwtAuthGuard)
  @Mutation(() => CategoryResponse)
  async updateCategory(
    @Args('input') input: UpdateCategoryInput,
    @TokenInfo() payload: JwtPayload,
  ) {
    const command = new UpdateCategoryCommand(
      payload.userId,
      input.categoryId,
      input.categoryName,
    );
    return await this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CategoryResponse)
  async deleteCategory(
    @Args('input') input: DeleteCategoryInput,
    @TokenInfo() payload: JwtPayload,
  ) {
    const command = new DeleteCategoryCommand(payload.userId, input.categoryId);
    return await this.commandBus.execute(command);
  }
}
