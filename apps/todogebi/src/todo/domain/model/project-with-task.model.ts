import { Prisma } from '@prisma/client';

// 쿼리 결과 타입
type ProjectWithCategoriesAndTasks = Prisma.ProjectGetPayload<{
  include: {
    categories: {
      include: {
        tasks: true;
      };
    };
  };
}>;

// 서비스 모델 타입
export type ProjectWithTaskModel = ProjectWithCategoriesAndTasks | null;
