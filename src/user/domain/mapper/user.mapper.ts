import { Users } from '@prisma/client';
import { UserModel } from '@src/user/domain/model/user.model';

export class UserMapper {
  static fromPrismaToDomain(user: Users): UserModel {
    return UserModel.create({
      email: user.email ?? undefined,
      password: user.password,
      birthday: user.birthday ?? undefined,
      createdAt: user.createdAt,
      nickname: user.nickname,
      updatedAt: user.updatedAt,
      id: user.id,
    });
  }
}
