import { Prisma } from '@prisma/client';
import { UserModel } from '@src/user/domain/model/user.model';

export const UserRepositorySymbol = Symbol.for('UserRepository');

// 공통적인 메서드 정의를 위한 기본 인터페이스
export interface IUserRepository {
  createUser: unknown;
  updateUser: unknown;
  deleteUser: unknown;
  findUser: unknown;
}

// Prisma를 사용하는 UserRepository 인터페이스
export type PrismaUserRepositoryArgs = {
  createUser: Prisma.UsersCreateArgs;
  updateUser: Prisma.UsersUpdateArgs;
  deleteUser: Prisma.UsersDeleteArgs;
  findUser: Prisma.UsersFindFirstArgs;
};

// 제너릭을 활용한 유연한 UserRepository 인터페이스
export interface IUserRepositoryGeneric<T extends Record<string, any>> {
  createUser(data: T['createUser']): Promise<UserModel>;
  updateUser(data: T['updateUser']): Promise<UserModel>;
  deleteUser(data: T['deleteUser']): Promise<UserModel>;
  findUser(data: T['findUser']): Promise<UserModel | null>;
}
