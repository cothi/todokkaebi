import { CreateCategoryCommand } from '@/todo/application/commands/create-category.command';
import { DeleteCategoryCommand } from '@/todo/application/commands/delete-category.command';
import { UpdateCategoryCommand } from '@/todo/application/commands/update-category.command';
import { GetCategoryQuery } from '@/todo/application/queries/get-category.query';
import { CategoryModel } from '@/todo/domain/model/category.model';
import { ProjectModel } from '@/todo/domain/model/project.model';
import { CategoryRepository } from '@/todo/infrastructure/database/repository/category.repository';
import { ErrorCode } from '@/utils/exception/error-code.enum';
import { errorFactory } from '@/utils/exception/error-factory.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /*  async getAllCategories(
    query: ,
    userId: string,
  ): Promise<CategoryModel[]> {
    if (query.userId !== userId) {
      throw errorFactory(ErrorCode.UNAUTHORIZED);
    }
    const categories = await this.categoryRepository.getAllCategories(
      query.projectId,
    );

    const categoriesWithDates = await Promise.all(
      categories.map(category => this.insertDate(category.id, category)),
    );
    return categoriesWithDates;
  }
*/
  async getCategoryWithId(query: GetCategoryQuery): Promise<CategoryModel> {
    const category = await this.categoryRepository.getCategoryById(query.id);

    if (!category) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }
    const insertDate = await this.insertDate(category.id, category);
    const insertCount =
      await this.insertCategoryTotalAndCompleteTaskCount(insertDate);
    return insertCount;
  }

  async insertCategoryTotalAndCompleteTaskCount(
    model: CategoryModel,
  ): Promise<CategoryModel> {
    model.completeTask =
      await this.categoryRepository.getCategoryCompleteTaskCount(model.id);
    model.totalTask = model.tasks?.length ?? 0;
    return model;
  }
  async insertCategoriesTotalAndCompleteTaskCount(
    models: CategoryModel[] | undefined,
  ): Promise<CategoryModel[] | undefined> {
    // 각 카테고리에 대해 insertCategoryTotalAndCompleteTaskCount 함수를 실행
    if (!models) {
      return undefined;
    }
    const updatedModels = await Promise.all(
      models.map(async model => {
        return this.insertCategoryTotalAndCompleteTaskCount(model);
      }),
    );

    return updatedModels;
  }

  async createCategory(command: CreateCategoryCommand): Promise<CategoryModel> {
    return await this.categoryRepository.createCategory({
      name: command.name,
      Project: {
        connect: {
          id: command.projectId,
        },
      },
    });
  }

  async updateCategory(cmd: UpdateCategoryCommand): Promise<CategoryModel> {
    const updateCategory = await this.categoryRepository.updateCategory(
      cmd.id,
      {
        name: cmd.name,
      },
    );
    const insertDate = await this.insertDate(updateCategory.id, updateCategory);
    return await this.insertCategoryTotalAndCompleteTaskCount(insertDate);
  }

  async deleteCategory(cmd: DeleteCategoryCommand): Promise<CategoryModel> {
    return await this.categoryRepository.deleteCategory(cmd.categoryId);
  }

  async validateUserId(userId: string, categoryId: string): Promise<void> {
    const category = await this.categoryRepository.getCategoryById(categoryId);
    if (!category) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }
    const categoryUserId =
      await this.categoryRepository.getCategoryUserId(categoryId);
    if (!categoryUserId) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }
    if (userId !== categoryUserId) {
      throw errorFactory(ErrorCode.UNAUTHORIZED);
    }
  }

  async insertsDateWithProjects(
    models: ProjectModel[],
  ): Promise<ProjectModel[]> {
    // 각 ProjectModel에서 categories 배열을 비동기로 처리
    const projectsWithDates = await Promise.all(
      models.map(async project => {
        if (project.categories) {
          // 각 project.categories 배열을 처리하여 새로운 값을 할당
          project.categories = await this.insertsDate(project.categories);
        }
        return project;
      }),
    );
    return projectsWithDates;
  }

  async insertsDate(
    categoryModels: CategoryModel[] | undefined,
  ): Promise<CategoryModel[] | undefined> {
    if (!categoryModels) return undefined;
    const promise = categoryModels.map(model =>
      this.insertDate(model.id, model),
    );
    return await Promise.all(promise);
  }

  async insertsCount(
    categoryModels: CategoryModel[] | undefined,
  ): Promise<CategoryModel[] | undefined> {
    if (!categoryModels) return undefined;
  }

  private async insertDate(
    categoryId: string,
    categoryModel: CategoryModel,
  ): Promise<CategoryModel> {
    const date = await this.categoryRepository.getCategoryRange(categoryId);
    if (date.startDate) categoryModel.startedAt = date.startDate;
    if (date.startDate) categoryModel.actualStartDate = date.startDate;
    if (date.actualEndDate) categoryModel.actualEndDate = date.actualEndDate;
    if (date.endDate) categoryModel.endedAt = date.endDate;
    return categoryModel;
  }
}
