import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export enum GraphQLResolverEnum {
  CREATE_USER = 'CREATE_USER',
  GET_USER = 'GET_USER',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_USER = 'UPDATE_USER',
  REISSUE_ACCESS_TOKEN = 'REISSUE_ACCESS_TOKEN',
  CREATE_PROJECT = 'CREATE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  GET_USER_PROJECT = 'GET_USER_PROJECT',
  GET_USER_ALL_PROJECT = 'GET_USER_ALL_PROJECT',
  CREATE_CATEGORY = 'CREATE_CATEGORY',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
  DELETE_CATEGORY = 'DELETE_CATEGORY',
  GET_CATEGORY = 'GET_CATEGORY',
  GET_ALL_CATEGORY = 'GET_ALL_CATEGORY',
}

export type CreateUserInput = {
  email: string;
  password: string;
  nickname: string;
};

export type UpdateUserInfoInput = {
  nickname: string;
  birthday: Date;
  email: string;
};

export type ReissueAccessTokenInput = {
  refreshToken: string;
};

type GraphQLQuery = string;

export const GraphQLAPI: Record<GraphQLResolverEnum, GraphQLQuery> = {
  [GraphQLResolverEnum.CREATE_USER]: `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        accessToken
        refreshToken
      }
    }
  `,
  [GraphQLResolverEnum.UPDATE_USER]: `
    mutation UpdateUserInfo($input: UpdateUserInfoInput!) {
      updateUserInfo(input: $input) {
        id
        email
        nickname
        birthday
      }
    } 
  `,
  [GraphQLResolverEnum.DELETE_ACCOUNT]: `
    mutation DeleteUser {
      deleteUser {
        success
      }
    }
  `,
  [GraphQLResolverEnum.GET_USER]: `
    query GetUserInfo {
      getUserInfo {
        id
        email
        nickname
        birthday
      }
    }
  `,
  [GraphQLResolverEnum.REISSUE_ACCESS_TOKEN]: `
    mutation ReissueAccessToken($input: ReissueAccessTokenInput!) {
      reissueAccessToken(input: $input) {
        accessToken
      }
    }
  `,
  [GraphQLResolverEnum.CREATE_PROJECT]: `
    mutation CreateProject($input: CreateProjectInput!) {
      createProject(input: $input) {
        success
        project {
            id
            name
            userId
        }
      }
    }
  `,
  [GraphQLResolverEnum.DELETE_PROJECT]: `
    mutation DeleteProject($input: DeleteProjectInput!) {
      deleteProject(input: $input) {
        success
        project {
            id
            name
            userId
        }
      }
    } 
  `,
  [GraphQLResolverEnum.UPDATE_PROJECT]: `
    mutation UpdateProject($input: UpdateProjectInput!) {
      updateProject(input: $input) {
         success
          project {
              id
              name
              userId
          }
      }
    }
  `,
  [GraphQLResolverEnum.GET_USER_PROJECT]: `
    query GetProject($input: GetProjectInput!) {
      getProject(input: $input) {
        success
        project {
            id
            name
            userId
        }
      }
    }
  `,
  [GraphQLResolverEnum.GET_USER_ALL_PROJECT]: `
    query GetAllProjects {
      getAllProjects {
          success
          totalNumber
          projects {
              id
              name
              userId
          }
      }
    }
  `,
  [GraphQLResolverEnum.CREATE_CATEGORY]: `
    mutation CreateCategory($input: CreateCategoryInput!) {
      createCategory(input: $input) {
          success
          category {
              id
              name
              projectId
          }
      }
    }
  `,
  [GraphQLResolverEnum.UPDATE_CATEGORY]: `
    mutation UpdateCategory($input: UpdateCategoryInput!) {
      updateCategory(input: $input) {
          success
          category {
              id
              name
              projectId
          }
      }
    }
  `,
  [GraphQLResolverEnum.DELETE_CATEGORY]: `
    mutation DeleteCategory($input: DeleteCategoryInput!) {
      deleteCategory(input: $input) {
          success
          category {
              id
              name
              projectId
          }
      }
    }
  `,
  [GraphQLResolverEnum.GET_CATEGORY]: `
    mutation GetCategory($input: GetCategoryInput!) {
      getCategory(input: $input) {
          success
          category {
              id
              name
              projectId
          }
      }
    }
  `,
  [GraphQLResolverEnum.GET_ALL_CATEGORY]: `
    mutation GetAllCategories($input: GetAllCategoriesInput!) {
      getAllCategories(input: $input) {
          success
          total
          categories {
              id
              name
              projectId
          }
      }
    }

  `,
};

export async function executeGraphql(
  app: INestApplication,
  queryName: GraphQLResolverEnum,
  variables?: any,
  token?: string,
) {
  const query = GraphQLAPI[queryName];
  const req = request(app.getHttpServer())
    .post('/graphql')
    .send({ query, variables });

  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }
  return await req;
}
