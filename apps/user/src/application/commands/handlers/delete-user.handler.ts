import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '@user/application/commands/delete-user.command';
import { UserService } from '@user/application/services/user.service';
import { DeleteUserParam } from '@user/application/params/delete-user.param';
@Injectable()
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userService: UserService) {}
  async execute(command: DeleteUserCommand): Promise<void> {
    await this.userService.deleteUser(new DeleteUserParam(command.id));
  }
}
