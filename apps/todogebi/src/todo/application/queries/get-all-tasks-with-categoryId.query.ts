import { IQuery } from '@nestjs/cqrs';

export class GetAllTasksWithCategoryIdQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly categoryId: string,
  ) {}
}
