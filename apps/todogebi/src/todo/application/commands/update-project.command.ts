import { ICommand } from '@nestjs/cqrs';

export class UpdateProjectCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly name: string,
  ) {}
}
