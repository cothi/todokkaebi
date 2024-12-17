import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserInput } from '@user/presentation/dto/inputs/update-user.input';
import { TokenInfo } from '@libs/decorators';
import { JwtAuthGuard, JwtPayload } from '@libs/jwt';
import { ApiResponse, ResponseManager } from '@libs/response';
import { UpdateUserCommand } from '@user/application/commands/update-user.command';
import { CreateUserInput } from '@user/presentation/dto/inputs/create-user.input';
import { CreateUserCommand } from '@user/application/commands/create-user.command';
import { UseGuards } from '@nestjs/common';
import { DeleteUserCommand } from '@user/application/commands/delete-user.command';
import { UpdateUserResult } from '@user/application/results/update-user.result';
import { CreateUserResult } from '@user/application/results/create-user.result';

@Resolver()
export class UserResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => UpdateUserResult)
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<ApiResponse<CreateUserResult>> {
    const result = await this.commandBus.execute(
      new UpdateUserCommand(
        payload.userId,
        input.nickname,
        input.email,
        input.password,
      ),
    );
    return ResponseManager.create(result);
  }
  @Mutation(() => CreateUserResult)
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<ApiResponse<CreateUserResult>> {
    const result = await this.commandBus.execute(
      new CreateUserCommand(
        input.email,
        input.nickname,
        input.password,
        input.birthday,
      ),
    );
    return ResponseManager.create(result);
  }

  @Mutation(() => ApiResponse)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@TokenInfo() payload: JwtPayload) {
    await this.commandBus.execute(new DeleteUserCommand(payload.userId));
    return ResponseManager.create();
  }
}
