import { CategoryMapper } from '@/todo/domain/mapper/category.mapper';
import { CategoryModel } from '@/todo/domain/model/category.model';
import { PrismaService } from '@/todo/infrastructure/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCategories(projectId: string): Promise<CategoryModel[]> {
    const categories = await this.prismaService.category.findMany({
      where: {
        projectId,
      },
    });

    return CategoryMapper.toDomains(categories);
  }

  async getCategoryById(id: string): Promise<CategoryModel | null> {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
      },
    });
    if (!category) {
      return null;
    }
    return CategoryMapper.CategoryTasksToDomain(category);
  }
  async countCategoryTasks(categoryId: string): Promise<number> {
    const counts = await this.prismaService.task.count({
      where: {
        Category: {
          id: categoryId,
        },
      },
    });
    return counts;
  }
  async countCategoryCompleteTasks(categoryId: string): Promise<number> {
    const counts = await this.prismaService.task.count({
      where: {
        check: true,
        Category: {
          id: categoryId,
        },
      },
    });
    return counts;
  }

  async getUserIdWithCategoryId(id: string): Promise<string | null> {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      include: {
        Project: true,
      },
    });
    if (!category) {
      return null;
    }
    return category.Project.userId;
  }

  async createCategory(
    data: Prisma.CategoryCreateInput,
  ): Promise<CategoryModel> {
    const category = await this.prismaService.category.create({
      data,
    });

    return CategoryMapper.toDomain(category);
  }

  async updateCategory(
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<CategoryModel> {
    const category = await this.prismaService.category.update({
      where: { id },
      data,
    });
    return CategoryMapper.toDomain(category);
  }

  async deleteCategory(id: string): Promise<CategoryModel> {
    const category = await this.prismaService.category.delete({
      where: { id },
      include: {
        Project: true,
      },
    });

    return CategoryMapper.toDomain(category);
  }

  async getCategoryUserId(id: string): Promise<string | null> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: {
        Project: {
          select: { userId: true },
        },
      },
    });
    if (!category) {
      return null;
    }
    return category.Project.userId;
  }
  async getCategoryCompleteTaskCount(categoryId: string): Promise<number> {
    return this.prismaService.task.count({
      where: {
        categoryId: categoryId,
        check: true,
      },
    });
  }

  async getCategoryRange(categoryId: string): Promise<{
    categoryId: string;
    startDate: Date | null;
    endDate: Date | null;
    actualEndDate: Date | null;
  }> {
    const duration = await this.prismaService.task.aggregate({
      _min: {
        startDate: true,
      },
      _max: {
        endDate: true,
      },
      where: {
        Category: {
          id: categoryId,
        },
      },
    });
    const actualDuration = await this.prismaService.task.aggregate({
      _max: {
        actualEndDate: true,
      },
    });
    return {
      categoryId,
      startDate: duration._min.startDate,
      endDate: duration._max.endDate,
      actualEndDate: actualDuration._max.actualEndDate,
    };
  }
}
