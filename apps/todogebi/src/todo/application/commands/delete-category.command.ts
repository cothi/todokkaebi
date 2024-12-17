import { ICommand } from '@nestjs/cqrs';

export class DeleteCategoryCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly categoryId: string,
  ) {}
}
