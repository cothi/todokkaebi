import { IQuery } from '@nestjs/cqrs';

export class GetTaskQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly projectId: string,
  ) {}
}
