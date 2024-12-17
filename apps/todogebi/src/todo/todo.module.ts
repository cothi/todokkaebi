import { CreateCategoryHandler } from '@/todo/application/commands/handlers/create-category.handler';
import { CreateProjectHandler } from '@/todo/application/commands/handlers/create-project.handler';
import { CreateTaskHandler } from '@/todo/application/commands/handlers/create-task.handler';
import { DeleteCategoryHandler } from '@/todo/application/commands/handlers/delete-category.handler';
import { DeleteProjectHandler } from '@/todo/application/commands/handlers/delete-project.handler';
import { DeleteTaskHandler } from '@/todo/application/commands/handlers/delete-task.handler';
import { UpdateCategoryHandler } from '@/todo/application/commands/handlers/update-category.handler';
import { UpdateProjectHandler } from '@/todo/application/commands/handlers/update-project.handler';
import { UpdateTaskHandler } from '@/todo/application/commands/handlers/update-task.handler';
import { GetAllProjectHandler } from '@/todo/application/queries/handlers/get-all-project.handler';
import { GetAllTasksWithCategoryIdHandler } from '@/todo/application/queries/handlers/get-all-tasks-with-category-id.handler';
import { GetCategoryHandler } from '@/todo/application/queries/handlers/get-category.handler';
import { GetProjectHandler } from '@/todo/application/queries/handlers/get-project.handler';
import { GetTaskHandler } from '@/todo/application/queries/handlers/get-task.handler';
import { CategoryService } from '@/todo/application/services/category.service';
import { ProjectService } from '@/todo/application/services/project.serivce';
import { TaskService } from '@/todo/application/services/task.service';
import { DatabaseModule } from '@/todo/infrastructure/database/database.module';
import { CategoryRepository } from '@/todo/infrastructure/database/repository/category.repository';
import { ProjectRepository } from '@/todo/infrastructure/database/repository/project.repository';
import { TaskRepository } from '@/todo/infrastructure/database/repository/task.repository';
import { CategoryResolver } from '@/todo/presentation/resolvers/category.resolver';
import { ProjectResolver } from '@/todo/presentation/resolvers/project.resolver';
import { TaskResolver } from '@/todo/presentation/resolvers/task.resolver';
import { JwtTokenModule } from '@/utils/jwt/jwt.module';
import { TaskUpdateScheduler } from '@/utils/schedulers/task-update.scheduler';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtTokenModule,
    DatabaseModule,
    CqrsModule,
  ],
  providers: [
    ProjectResolver,
    CategoryResolver,
    TaskResolver,

    CreateProjectHandler,
    DeleteProjectHandler,
    UpdateProjectHandler,
    GetProjectHandler,
    GetAllProjectHandler,

    DeleteCategoryHandler,
    CreateCategoryHandler,
    UpdateCategoryHandler,

    GetCategoryHandler,

    GetAllTasksWithCategoryIdHandler,
    GetTaskHandler,
    CreateTaskHandler,
    DeleteTaskHandler,
    UpdateTaskHandler,

    CategoryService,
    ProjectService,
    TaskService,

    TaskRepository,
    ProjectRepository,
    CategoryRepository,

    TaskUpdateScheduler,
  ],
})
export class TodoModule {}
