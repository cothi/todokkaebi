import { AppModule } from '@/app.module';
import { CreateCategoryInput } from '@/todo/presentation/resolvers/dto/inputs/create-category.input';
import { CreateProjectInput } from '@/todo/presentation/resolvers/dto/inputs/create-project.input';
import { DeleteCategoryInput } from '@/todo/presentation/resolvers/dto/inputs/delete-category.input';
import { GetCategoryInput } from '@/todo/presentation/resolvers/dto/inputs/get-category.input';
import { GetProjectInput } from '@/todo/presentation/resolvers/dto/inputs/get-project.input';
import { UpdateCategoryInput } from '@/todo/presentation/resolvers/dto/inputs/update-category.input';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskState } from '@prisma/client';
import * as uuid from 'uuid';
import {
  CreateUserInput,
  executeGraphql,
  GraphQLResolverEnum,
} from '../utils/graphql.helper';

describe('Todo Project Resolver (e2e)', () => {
  let app: INestApplication;

  let accessToken: string;
  let projectId: string;
  const createUserInput: { input: CreateUserInput } = {
    input: {
      email: uuid.v4() + '@email.com',
      password: 'password',
      nickname: 'nickname',
    },
  };

  const createProjectinput: { input: CreateProjectInput } = {
    input: {
      name: 'project',
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res1 = await executeGraphql(
      app,
      GraphQLResolverEnum.CREATE_USER,
      createUserInput,
    );
    const data1 = res1.body.data;
    accessToken = data1.createUser.accessToken;

    const res2 = await executeGraphql(
      app,
      GraphQLResolverEnum.CREATE_PROJECT,
      createProjectinput,
      accessToken,
    );
    const data2 = res2.body.data.createProject.project;
    projectId = data2.id;
  });

  describe('create category resolver (e2e)', () => {
    it('should create category', async () => {
      const inputData: { input: CreateCategoryInput } = {
        input: {
          name: 'category_name',
          projectId,
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_CATEGORY,
        inputData,
        accessToken,
      );
      console.log(res1.body);

      const data = res1.body.data.createCategory;
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('category');
      expect(data.category.name).toEqual('category_name');
    });
  });

  describe('update category resolver (e2e)', () => {
    it('should update category', async () => {
      const inputData: { input: CreateCategoryInput } = {
        input: {
          name: 'category_name',
          projectId,
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_CATEGORY,
        inputData,
        accessToken,
      );
      const data = res1.body.data.createCategory.category;

      const name = 'changed_name';
      const updateInputData: { input: UpdateCategoryInput } = {
        input: {
          categoryId: data.id,
          categoryName: name,
        },
      };
      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.UPDATE_CATEGORY,
        updateInputData,
        accessToken,
      );
      const data2 = res2.body.data.updateCategory.category;
      expect(data2.name).toEqual(name);
    });
  });

  describe('delete category resolver (e2e)', () => {
    it('should delete category', async () => {
      const inputData: { input: CreateCategoryInput } = {
        input: {
          name: 'category_name2',
          projectId,
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_CATEGORY,
        inputData,
        accessToken,
      );
      const data = res1.body.data.createCategory.category;
      const dataId = data.id;

      const deleteInputData: { input: DeleteCategoryInput } = {
        input: {
          categoryId: dataId,
        },
      };
      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.DELETE_CATEGORY,
        deleteInputData,
        accessToken,
      );
      expect(res2.body.data.deleteCategory.success).toEqual(true);
    });
  });

  describe('get category resolver (e2e)', () => {
    it('should get category', async () => {
      const inputData: { input: CreateCategoryInput } = {
        input: {
          name: 'category_name3',
          projectId,
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_CATEGORY,
        inputData,
        accessToken,
      );

      const data = res1.body.data.createCategory.category;
      const dataId = data.id;
      const getCategoryInput: { input: GetCategoryInput } = {
        input: {
          id: dataId,
        },
      };
      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.GET_CATEGORY,
        getCategoryInput,
        accessToken,
      );
      const data2 = res2.body.data.getCategory;
      expect(data2).toHaveProperty('category');
    });
  });

  describe('get all category resolver (e2e)', () => {
    it('should get all category', async () => {
      const getAllInputData: { input: GetProjectInput } = {
        input: {
          id: projectId,
          state: TaskState.PENDING,
        },
      };

      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.GET_USER_PROJECT,
        getAllInputData,
        accessToken,
      );

      const data2 = res2.body.data.getProject;
      expect(data2.project.categories.length).toEqual(3);

      //expect(data2).toEqual(3);
    });
  });
});
