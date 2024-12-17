import { ICommand } from '@nestjs/cqrs';
import { TaskState } from '@prisma/client';

export class UpdateCategoryCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly name?: string,
    public readonly status?: TaskState,
  ) {}
}
