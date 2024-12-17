import { ICommand } from '@nestjs/cqrs';

export class UpdateTaskCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly projectId: string,
    public readonly title?: string,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly check?: boolean,
  ) {}
}
