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
    });

    if (!category) {
      return null;
    }
    return CategoryMapper.toDomain(category);
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
}
