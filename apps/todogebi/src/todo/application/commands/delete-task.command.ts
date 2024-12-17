import { ICommand } from '@nestjs/cqrs';

export class DeleteTaskCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly projectId: string,
  ) {}
}
