import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { Prisma } from '@prisma/client';
import { UserModel } from '@src/auth/domain/model/user.model';
import { UserMapper } from '@src/auth/domain/mapper/user.mapper';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<UserModel> {
    const user = await this.prismaService.user.create({
      data,
    });

    return UserMapper.toDomain(user);
  }

  async updateUser(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserModel> {
    const user = await this.prismaService.user.update({
      where: { id },
      data,
    });
    return UserMapper.toDomain(user);
  }

  async deleteUser(id: string): Promise<UserModel> {
    const user = await this.prismaService.user.delete({
      where: { id },
    });
    return UserMapper.toDomain(user);
  }

  async getUser(id: string): Promise<UserModel | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      return null;
    }
    return UserMapper.toDomain(user);
  }
  async getUserWithEmail(email: string): Promise<UserModel | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }
    return UserMapper.toDomain(user);
  }

  async getKakaoUser(kakaoId: string): Promise<UserModel | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OAuthProvider: {
          some: {
            provider: 'KAKAO',
            providerId: kakaoId,
          },
        },
      },
      include: {
        OAuthProvider: true,
      },
    });

    if (!user) {
      return null;
    }
    return UserMapper.toDomain(user);
  }
}
