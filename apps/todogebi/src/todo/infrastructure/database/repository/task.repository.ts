import { TaskMapper } from '@/todo/domain/mapper/task.mapper';
import { TaskModel } from '@/todo/domain/model/task.model';
import { PrismaService } from '@/todo/infrastructure/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, TaskState } from '@prisma/client';

@Injectable()
export class TaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createTask(data: Prisma.TaskCreateInput): Promise<TaskModel> {
    const task = await this.prismaService.task.create({
      data,
    });
    return TaskMapper.toDomain(task);
  }

  async updateTask(
    id: string,
    data: Prisma.TaskUpdateInput,
  ): Promise<TaskModel> {
    const task = await this.prismaService.task.update({
      where: { id },
      data,
    });
    return TaskMapper.toDomain(task);
  }

  async checkTasksPendingToProgress(now: Date): Promise<number> {
    const updatePending = this.prismaService.task.updateMany({
      where: {
        startDate: {
          lt: now,
        },
        status: TaskState.PENDING,
      },
      data: {
        status: TaskState.IN_PROGRESS,
        actualStartDate: now,
      },
    });
    const updateINPROFRESS = this.prismaService.task.updateMany({
      where: {
        startDate: {
          gt: now,
        },
        status: TaskState.IN_PROGRESS,
      },
      data: {
        status: TaskState.PENDING,
        actualStartDate: null, // 실제 시작 날짜도 null로 리셋할 수 있음
      },
    });
    const [updatedToInProgress, revertedToPending] = await Promise.all([
      updatePending,
      updateINPROFRESS,
    ]);

    return updatedToInProgress.count + revertedToPending.count;
  }

  async deleteTask(id: string): Promise<TaskModel> {
    const task = await this.prismaService.task.delete({
      where: { id },
    });
    return TaskMapper.toDomain(task);
  }

  async getTaskUserIdWithTaskId(id: string): Promise<string | null> {
    const task = await this.prismaService.task.findUnique({
      where: { id },
      include: {
        Category: {
          include: {
            Project: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });
    if (!task) {
      return null;
    }

    return task.Category.Project.userId;
  }

  async getTask(id: string): Promise<TaskModel | null> {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });
    if (!task) {
      return null;
    }
    return TaskMapper.toDomain(task);
  }

  async getAllTasksWithCategoryId(categoryId: string): Promise<TaskModel[]> {
    const tasks = await this.prismaService.task.findMany({
      where: { categoryId },
    });

    return TaskMapper.toDomains(tasks);
  }
}
