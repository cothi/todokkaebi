import { User } from '@user/domain/entity/user.entity';

export const UserRepositorySymbol = Symbol.for('UserRepository');

export interface DeleteUserArgs {
  id: string;
}

export interface FindUserArgs {
  id: string;
}

// 공통적인 메서드 정의를 위한 기본 인터페이스
export type UserBasicRepositoryArgs = {
  createUser: User;
  updateUser: User;
  deleteUser: DeleteUserArgs;
  findUser: FindUserArgs;
};

// 제너릭을 활용한 유연한 UserRepository 인터페이스
export interface IUserRepositoryGeneric<T extends Record<string, any>> {
  createUser(args: T['createUser']): Promise<void>;
  updateUser(args: T['updateUser']): Promise<void>;
  deleteUser(args: T['deleteUser']): Promise<void>;
  findUser(args: T['findUser']): Promise<User | null>;
}
