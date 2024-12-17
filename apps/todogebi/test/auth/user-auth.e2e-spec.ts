import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DateUtils } from '../utils/date';
import {
  CreateUserInput,
  executeGraphql,
  GraphQLResolverEnum,
  ReissueAccessTokenInput,
  UpdateUserInfoInput,
} from '../utils/graphql.helper';

describe('User Resolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('sign up', () => {
    it('should sign up a user', async () => {
      const createUser: { input: CreateUserInput } = {
        input: {
          email: 'email1@email.com',
          password: 'password',
          nickname: 'nickname',
        },
      };

      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_USER,
        createUser,
      );

      const data1 = res1.body.data;
      expect(data1).toHaveProperty('createUser');
      expect(data1.createUser).toHaveProperty('accessToken');
      expect(data1.createUser).toHaveProperty('refreshToken');
    });
    it('Failed to sign up with duplicate email', async () => {
      const createUser: { input: CreateUserInput } = {
        input: {
          email: 'email1@email.com',
          password: 'password',
          nickname: 'nickname',
        },
      };

      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_USER,
        createUser,
      );

      const data1 = res1.body;
      expect(data1).toHaveProperty('errors');
    });
  });

  describe('get user (e2e)', () => {
    it('should get user info', async () => {
      const createUser: { input: CreateUserInput } = {
        input: {
          email: 'email2@email.com',
          password: 'password',
          nickname: 'nickname',
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_USER,
        createUser,
      );
      const data1 = res1.body.data;
      const token = data1.createUser.accessToken;

      expect(data1).toHaveProperty('createUser');
      expect(data1.createUser).toHaveProperty('accessToken');
      expect(data1.createUser).toHaveProperty('refreshToken');

      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.GET_USER,
        null,
        token,
      );

      const data2 = res2.body.data;
      const getUserInfo = data2.getUserInfo;

      expect(data2).toHaveProperty('getUserInfo');
      expect(getUserInfo).toHaveProperty('id');
    });
  });

  describe('delete user (e2e)', () => {
    it('should delete user', async () => {
      const createUser: { input: CreateUserInput } = {
        input: {
          email: 'email3@email.com',
          password: 'password',
          nickname: 'nickname',
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_USER,
        createUser,
      );
      const data1 = res1.body.data;
      const token = data1.createUser.accessToken;

      expect(data1).toHaveProperty('createUser');
      expect(data1.createUser).toHaveProperty('accessToken');
      expect(data1.createUser).toHaveProperty('refreshToken');

      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.DELETE_ACCOUNT,
        null,
        token,
      );
      const data2 = res2.body.data;
      const result = data2.deleteUser;
      expect(result.success).toBe(true);
    });
  });

  describe('update user (e2e)', () => {
    it('should update user', async () => {
      const createUser: { input: CreateUserInput } = {
        input: {
          email: 'email3@email.com',
          password: 'password',
          nickname: 'nickname',
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_USER,
        createUser,
      );
      const data1 = res1.body.data;
      const token = data1.createUser.accessToken;

      expect(data1).toHaveProperty('createUser');
      expect(data1.createUser).toHaveProperty('accessToken');
      expect(data1.createUser).toHaveProperty('refreshToken');

      const birthDay = DateUtils.createDate(2024, 12, 20);

      const updateUserInfo: { input: UpdateUserInfoInput } = {
        input: {
          birthday: birthDay,
          email: 'email4@email.com',
          nickname: 'changed_name',
        },
      };

      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.UPDATE_USER,
        updateUserInfo,
        token,
      );
      const data2 = res2.body.data;

      expect(data2.updateUserInfo.email).toEqual('email4@email.com');
      expect(data2.updateUserInfo.nickname).toEqual('changed_name');
      expect(DateUtils.fromISOString(data2.updateUserInfo.birthday)).toEqual(
        birthDay,
      );
    });
  });

  describe('refresh token', () => {
    it('should reissue accessToken using refresh token ', async () => {
      const createUser: { input: CreateUserInput } = {
        input: {
          email: 'email5@email.com',
          password: 'password',
          nickname: 'nickname',
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_USER,
        createUser,
      );
      const data1 = res1.body.data;
      const refreshToken = data1.createUser.refreshToken;

      expect(data1).toHaveProperty('createUser');
      expect(data1.createUser).toHaveProperty('accessToken');
      expect(data1.createUser).toHaveProperty('refreshToken');

      const reissueAccessToken: { input: ReissueAccessTokenInput } = {
        input: {
          refreshToken: refreshToken,
        },
      };
      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.REISSUE_ACCESS_TOKEN,
        reissueAccessToken,
      );
      expect(res2.body.data.reissueAccessToken).toHaveProperty('accessToken');
    });
  });
});
