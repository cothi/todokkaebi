import { IQuery } from '@nestjs/cqrs';

export class LoginUserQuery implements IQuery {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
