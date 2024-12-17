import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@Injectable()
@QueryHandler(LoginUserQuery)
export class LoginUserHandler implements IQueryHandler {
  constructor(private readonly userAuthService: UserAuthService) {}
  async execute(query: LoginUserQuery): Promise<UserModel> {
    try {
      return await this.userAuthService.authenticate(
        new LoginDto(query.email, query.password),
      );
    } catch (e) {
      throw e;
    }
  }
}
