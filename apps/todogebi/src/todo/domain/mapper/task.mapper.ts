import { TaskModel } from '@/todo/domain/model/task.model';
import { Task } from '@prisma/client';

export class TaskMapper {
  static toDomain(task: Task): TaskModel {
    return {
      ...task,
    };
  }

  static toDomains(tasks: Task[]): TaskModel[] {
    return tasks.map(task => this.toDomain(task));
  }
}
