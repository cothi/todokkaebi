import { CreateTaskCommand } from '@/todo/application/commands/create-task.command';
import { DeleteTaskCommand } from '@/todo/application/commands/delete-task.command';
import { UpdateTaskCommand } from '@/todo/application/commands/update-task.command';
import { TaskModel } from '@/todo/domain/model/task.model';
import { TaskRepository } from '@/todo/infrastructure/database/repository/task.repository';
import { ErrorCode } from '@/utils/exception/error-code.enum';
import { errorFactory } from '@/utils/exception/error-factory.exception';
import { Injectable } from '@nestjs/common';
import { Prisma, TaskState } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(command: CreateTaskCommand): Promise<TaskModel> {
    const now = new Date();
    let status: TaskState = TaskState.PENDING;
    if (command.startDate && command.startDate < now) {
      status = TaskState.IN_PROGRESS;
    }

    const createData: Prisma.TaskCreateInput = {
      title: command.title,
      startDate: command.startDate,
      actualStartDate: command.startDate,
      endDate: command.endDate,
      status,
      Category: {
        connect: {
          id: command.categoryId,
        },
      },
    };

    return await this.taskRepository.createTask(createData);
  }

  async deleteTask(command: DeleteTaskCommand): Promise<TaskModel> {
    return await this.taskRepository.deleteTask(command.id);
  }
  async updatePendingToINProgress(date: Date): Promise<number> {
    return await this.taskRepository.checkTasksPendingToProgress(date);
  }

  async updateTask(command: UpdateTaskCommand): Promise<TaskModel> {
    const now = new Date();

    const updateDate: Prisma.TaskUpdateInput = {
      title: command.title,
      check: command.check,
      startDate: command.startDate,
      actualStartDate: command.startDate,
      endDate: command.endDate,
    };

    if (command.check === true) {
      updateDate.status = TaskState.COMPLETE;
      updateDate.actualEndDate = now;
    } else if (command.check === false) {
      updateDate.status = TaskState.IN_PROGRESS;
      if (command.startDate && now > command.startDate) {
        updateDate.status = TaskState.PENDING;
      }
    }
    return await this.taskRepository.updateTask(command.id, updateDate);
  }
  async getTaskWithTaskId(taskId: string): Promise<TaskModel> {
    const task = await this.taskRepository.getTask(taskId);
    if (!task) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }

    return task;
  }
  async getAllTasksWithCategoryId(categoryId: string): Promise<TaskModel[]> {
    return await this.taskRepository.getAllTasksWithCategoryId(categoryId);
  }

  async validateTaskWithUserId(taskId: string, userId: string): Promise<void> {
    const taskUserId =
      await this.taskRepository.getTaskUserIdWithTaskId(taskId);

    if (!taskUserId) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }
    if (taskUserId !== userId) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }
  }
}
