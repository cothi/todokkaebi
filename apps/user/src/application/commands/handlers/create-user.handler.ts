import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateUserCommand } from '@user/application/commands/create-user.command';
import { UserService } from '@user/application/services/user.service';
import { CreateUserParam } from '@user/application/params/create-user.param';
import { CreateUserResult } from '@user/application/results/create-user.result';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UserService) {}
  async execute(command: CreateUserCommand): Promise<CreateUserResult> {
    const user = await this.userService.createUser(
      new CreateUserParam(command.email, command.nickname, command.birthday),
    );
    return {
      birthday: user.birthday,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      id: user.id,
    };
  }
}
