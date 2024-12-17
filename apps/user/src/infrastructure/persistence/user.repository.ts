import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import {
  IUserRepositoryGeneric,
  UserBasicRepositoryArgs,
} from '@user/domain/interface/user-repository.interface';
import { UserMapper } from '@user/infrastructure/persistence/mapper/user.mapper';
import { User } from '@user/domain/entity/user.entity';

// 유저 생성, 삭제, 조회, 업데이트
@Injectable()
export class PrismaUserRepositoryImpl
  implements IUserRepositoryGeneric<UserBasicRepositoryArgs>
{
  constructor(private readonly prisma: PrismaService) {}
  async createUser(args: UserBasicRepositoryArgs['createUser']): Promise<void> {
    const data = UserMapper.toPersistence(args);
    await this.prisma.user.create({ data });
  }
  async updateUser(args: UserBasicRepositoryArgs['updateUser']): Promise<void> {
    const data = UserMapper.toPersistence(args);
    await this.prisma.user.update({
      where: { id: data.id },
      data,
    });
  }
  async deleteUser(args: UserBasicRepositoryArgs['deleteUser']): Promise<void> {
    await this.prisma.user.delete({
      where: { id: args.id },
    });
  }

  async findUser(
    args: UserBasicRepositoryArgs['findUser'],
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id: args.id } });
    if (!user) {
      return null;
    }
    return UserMapper.toDomain({
      id: user.id,
      email: user.email,
      birthday: user.birthday ?? undefined,
      nickname: user.nickname,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    });
  }
}
