import { IQuery } from '@nestjs/cqrs';
import { TaskState } from '@prisma/client';

export class GetProjectQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly status: TaskState,
  ) {}
}
