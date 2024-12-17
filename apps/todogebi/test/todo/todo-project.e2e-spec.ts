import { AppModule } from '@/app.module';
import { CreateProjectInput } from '@/todo/presentation/resolvers/dto/inputs/create-project.input';
import { DeleteProjectInput } from '@/todo/presentation/resolvers/dto/inputs/delete-project.input';
import { GetProjectInput } from '@/todo/presentation/resolvers/dto/inputs/get-project.input';
import { UpdateProjectInput } from '@/todo/presentation/resolvers/dto/inputs/update-project.input';
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
  const createUser: { input: CreateUserInput } = {
    input: {
      email: uuid.v4() + '@email.com',
      password: 'password',
      nickname: 'nickname',
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
      createUser,
    );
    const data1 = res1.body.data;
    accessToken = data1.createUser.accessToken;
  });

  describe('should create project resolver (e2e)', () => {
    it('create project ', async () => {
      const data: { input: CreateProjectInput } = {
        input: {
          name: 'project',
        },
      };

      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_PROJECT,
        data,
        accessToken,
      );
      const data1 = res1.body.data.createProject.project;
      expect(data1.name).toEqual('project');
    });
  });

  describe('get project resolver (e2e)', () => {
    it('should get project ', async () => {
      const inputData: { input: CreateProjectInput } = {
        input: {
          name: 'project2',
        },
      };

      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_PROJECT,
        inputData,
        accessToken,
      );
      const data1 = res1.body.data.createProject.project;
      expect(data1.name).toEqual('project2');

      const inputData2: { input: GetProjectInput } = {
        input: {
          id: data1.id,
          state: TaskState.PENDING,
        },
      };
      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.GET_USER_PROJECT,
        inputData2,
        accessToken,
      );
      const data2 = res2.body;
      expect(data2.data.getProject.success).toEqual(true);
    });
  });
  describe('should get all projects (e2)', () => {
    it('should get all projects ', async () => {
      const res = await executeGraphql(
        app,
        GraphQLResolverEnum.GET_USER_ALL_PROJECT,
        null,
        accessToken,
      );

      const data = res.body.data.getAllProjects;
      expect(data).toHaveProperty('success');
      expect(data.success).toEqual(true);
    });
  });
  describe('delete project resolver(e2e)', () => {
    it('should delete project', async () => {
      const inputData: { input: CreateProjectInput } = {
        input: {
          name: 'project3',
        },
      };

      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_PROJECT,
        inputData,
        accessToken,
      );
      const data1 = res1.body.data.createProject.project;
      expect(data1.name).toEqual('project3');
      const id = data1.id;
      const inputData2: { input: DeleteProjectInput } = {
        input: {
          projectId: id,
        },
      };

      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.DELETE_PROJECT,
        inputData2,
        accessToken,
      );
      const data = res2.body.data.deleteProject;
      expect(data.success).toBe(true);
    });
  });

  describe('should delete project resolver (e2e)', () => {
    it('should delete project ', async () => {
      const inputData: { input: CreateProjectInput } = {
        input: {
          name: 'project4',
        },
      };

      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_PROJECT,
        inputData,
        accessToken,
      );
      const data1 = res1.body.data.createProject.project;
      expect(data1.name).toEqual('project4');

      const inputData2: { input: DeleteProjectInput } = {
        input: {
          projectId: data1.id,
        },
      };
      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.DELETE_PROJECT,
        inputData2,
        accessToken,
      );
      const data2 = res2.body.data.deleteProject;
      expect(data2.success).toEqual(true);
    });
  });
  describe('should update project resolver (e2e)', () => {
    it('should update project ', async () => {
      const inputData: { input: CreateProjectInput } = {
        input: {
          name: 'project5',
        },
      };

      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_PROJECT,
        inputData,
        accessToken,
      );
      const data1 = res1.body.data.createProject.project;
      expect(data1.name).toEqual('project5');

      const changeName = 'changeName';
      const inputData2: { input: UpdateProjectInput } = {
        input: {
          name: changeName,
          projectId: data1.id,
        },
      };
      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.UPDATE_PROJECT,
        inputData2,
        accessToken,
      );
      const data2 = res2.body.data.updateProject.project;
      expect(data2.name).toEqual(changeName);
    });
  });

  describe('should create resolver (e2e)', () => {
    it('should create project ', async () => {
      const inputData: { input: CreateProjectInput } = {
        input: {
          name: 'project6',
        },
      };

      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_PROJECT,
        inputData,
        accessToken,
      );
      const data1 = res1.body.data.createProject.project;
      expect(data1.name).toEqual('project6');
    });
  });
});
