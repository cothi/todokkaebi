import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@user/application/services/user.service';
import { UpdateUserCommand } from '@user/application/commands/update-user.command';
import { UpdateUserParam } from '@user/application/params/update-user.param';

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userService: UserService) {}
  async execute(command: UpdateUserCommand): Promise<void> {
    await this.userService.updateUser(
      new UpdateUserParam(
        command.id,
        command.email,
        command.nickname,
        command.birthday,
      ),
    );
  }
}
