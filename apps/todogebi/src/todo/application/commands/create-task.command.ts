import { ICommand } from '@nestjs/cqrs';

export class CreateTaskCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly categoryId: string,
    public readonly projectId: string,
  ) {}
}
