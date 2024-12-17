import { AppModule } from '@/app.module';
import { CreateCategoryInput } from '@/todo/presentation/resolvers/dto/inputs/create-category.input';
import { CreateProjectInput } from '@/todo/presentation/resolvers/dto/inputs/create-project.input';
import { CreateTaskInput } from '@/todo/presentation/resolvers/dto/inputs/create-task.input';
import { DeleteTaskInput } from '@/todo/presentation/resolvers/dto/inputs/delete-task.input';
import { GetProjectInput } from '@/todo/presentation/resolvers/dto/inputs/get-project.input';
import { UpdateTaskInput } from '@/todo/presentation/resolvers/dto/inputs/update-task.input';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskState } from '@prisma/client';
import * as uuid from 'uuid';
import { DateUtils } from '../utils/date';
import {
  CreateUserInput,
  executeGraphql,
  GraphQLResolverEnum,
} from '../utils/graphql.helper';

describe('Todo Project Resolver (e2e)', () => {
  let app: INestApplication;

  let accessToken: string;
  let projectId: string;
  let categoryId: string;

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

    const createCategoryInputData: { input: CreateCategoryInput } = {
      input: {
        name: 'category_name2',
        projectId,
      },
    };
    const res3 = await executeGraphql(
      app,
      GraphQLResolverEnum.CREATE_CATEGORY,
      createCategoryInputData,
      accessToken,
    );
    const data = res3.body.data.createCategory.category;
    categoryId = data.id;
  });

  describe('create task resolver (e2e)', () => {
    it('should create task', async () => {
      const minDate = DateUtils.createDate(500, 1, 1);
      const inputDate: { input: CreateTaskInput } = {
        input: {
          categoryId,
          startDate: minDate,
          endDate: DateUtils.createDate(2024, 10, 3),
          title: 'test_111',
          projectId,
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_TASK,
        inputDate,
        accessToken,
      );
      const data = res1.body.data.createTask;

      expect(data.success).toBe(true);
      expect(DateUtils.fromISOString(data.task.startDate)).toEqual(minDate);
    });

    it('should create multiple task', async () => {
      const maxDate = DateUtils.createDate(9999, 9, 9);
      const minDate = DateUtils.createDate(500, 1, 1);
      const inputDate: { input: CreateTaskInput } = {
        input: {
          categoryId,
          startDate: DateUtils.createDate(1000, 8, 3),
          endDate: DateUtils.createDate(2024, 10, 3),
          title: 'test_222',
          projectId,
        },
      };
      await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_TASK,
        inputDate,
        accessToken,
      );
      const inputDate2: { input: CreateTaskInput } = {
        input: {
          categoryId,
          startDate: DateUtils.createDate(2025, 8, 3),
          endDate: maxDate,
          title: 'test_333',
          projectId,
        },
      };
      await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_TASK,
        inputDate2,
        accessToken,
      );
      const inputDate3: { input: GetProjectInput } = {
        input: {
          id: projectId,
          state: TaskState.IN_PROGRESS,
        },
      };
      const project = await executeGraphql(
        app,
        GraphQLResolverEnum.GET_USER_PROJECT,
        inputDate3,
        accessToken,
      );

      const projectData = project.body.data.getProject;
      const getEndDate = DateUtils.fromISOString(projectData.project.endDate);
      const getStartDate = DateUtils.fromISOString(
        projectData.project.startDate,
      );
      expect(getEndDate).toEqual(maxDate);
      expect(getStartDate).toEqual(minDate);
      expect(projectData.project.categories[0].tasks.length).toEqual(2);
    });
  });

  describe('update task resolver (e2e)', () => {
    it('should update task', async () => {
      const inputDate: { input: CreateTaskInput } = {
        input: {
          categoryId,
          endDate: DateUtils.createDate(2024, 10, 3),
          startDate: DateUtils.createDate(2024, 8, 3),
          title: 'test',
          projectId,
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_TASK,
        inputDate,
        accessToken,
      );
      const data = res1.body.data.createTask;
      const taskId = data.task.id;

      const changeTitle = 'changedTitle';
      const changeStartDate = DateUtils.createDate(2000, 10, 10);
      const changeEndDate = DateUtils.createDate(3000, 10, 10);
      const inputUpdateData: { input: UpdateTaskInput } = {
        input: {
          taskId,
          title: changeTitle,
          startDate: changeStartDate,
          check: true,
          taskState: TaskState.IN_PROGRESS,
          endDate: changeEndDate,
          projectId,
        },
      };

      const res2 = await executeGraphql(
        app,
        GraphQLResolverEnum.UPDATE_TASK,
        inputUpdateData,
        accessToken,
      );

      console.log(res2.body.data.updateTask.task);
      const data2 = res2.body.data.updateTask;
      expect(taskId).toEqual(res2.body.data.updateTask.task.id);
      expect(data2.success).toBe(true);
      expect(data2.task.title).toBe(changeTitle);
      expect(DateUtils.fromISOString(data2.task.endDate)).toEqual(
        changeEndDate,
      );
    });
  });
  describe('delete task resolver (e2e)', () => {
    it('should delete task', async () => {
      const createInputData: { input: CreateTaskInput } = {
        input: {
          categoryId,
          endDate: DateUtils.createDate(2024, 10, 3),
          startDate: DateUtils.createDate(2024, 8, 3),
          title: 'test',
          projectId,
        },
      };
      const res1 = await executeGraphql(
        app,
        GraphQLResolverEnum.CREATE_TASK,
        createInputData,
        accessToken,
      );
      const data = res1.body.data.createTask;
      const taskId = data.task.id;
      const deleteInputDate: { input: DeleteTaskInput } = {
        input: {
          taskId,
          projectId,
        },
      };

      const res = await executeGraphql(
        app,
        GraphQLResolverEnum.DELETE_TASK,
        deleteInputDate,
        accessToken,
      );

      expect(res.body.data.deleteTask.success).toEqual(true);
    });
  });
});
