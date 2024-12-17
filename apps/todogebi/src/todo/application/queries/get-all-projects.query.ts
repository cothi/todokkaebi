import { IQuery } from '@nestjs/cqrs';

export class GetAllProjectsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
