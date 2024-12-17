import { Inject, Injectable } from '@nestjs/common';
import { ErrorCode, errorFactory } from '@libs/exception';
import {
  IUserRepositoryGeneric,
  UserBasicRepositoryArgs,
  UserRepositorySymbol,
} from '@user/domain/interface/user-repository.interface';
import { CreateUserParam } from '@user/application/params/create-user.param';
import { User } from '@user/domain/entity/user.entity';
import { UpdateUserParam } from '@user/application/params/update-user.param';
import { DeleteUserParam } from '@user/application/params/delete-user.param';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: IUserRepositoryGeneric<UserBasicRepositoryArgs>,
  ) {}

  async createUser(param: CreateUserParam): Promise<User> {
    const user = User.create({
      nickname: param.nickname,
      email: param.email,
      birthday: param.birthday,
    });
    await this.userRepository.createUser(user);
    return user;
  }

  async deleteUser(param: DeleteUserParam): Promise<void> {
    const user = await this.userRepository.findUser({ id: param.id });
    if (!user) {
      throw errorFactory(ErrorCode.USER_NOT_FOUND);
    }
    await this.userRepository.deleteUser({
      id: user.id,
    });
  }
  async updateUser(param: UpdateUserParam): Promise<User> {
    const user = await this.userRepository.findUser({ id: param.id });
    if (!user) {
      throw errorFactory(ErrorCode.USER_NOT_FOUND);
    }
    user.changeProfile({
      birthday: param.birthday,
      email: param.email,
      nickname: param.nickname,
    });
    await this.userRepository.updateUser(user);
    return user;
  }
}
