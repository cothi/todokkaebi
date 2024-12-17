import { User } from '@user/domain/entity/user.entity';

interface UserPersistenceRecord {
  id: string;
  email: string;
  nickname: string;
  birthday?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDomainRecord {
  id: string;
  email: string;
  nickname: string;
  birthday?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export class UserMapper {
  static toPersistence(user: User): UserPersistenceRecord {
    return {
      id: user.id,
      birthday: user.birthday,
      createdAt: user.createdAt,
      email: user.email,
      nickname: user.nickname,
      updatedAt: user.updatedAt,
    };
  }

  static toDomain(record: UserDomainRecord): User {
    return User.fromPersistence({
      id: record.id,
      email: record.email,
      nickname: record.nickname,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
      birthday: record.birthday,
    });
  }
}
