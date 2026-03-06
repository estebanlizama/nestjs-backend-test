import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { TasksRepository } from '../repositories/tasks.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.create(createTaskDto);
  }

  findAll(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.findAll(filterDto.status, filterDto.priority);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id);

    return this.tasksRepository.update(id, updateTaskDto);
  }

  async updateStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    await this.findOne(id);

    return this.tasksRepository.updateStatus(id, updateTaskStatusDto.status);
  }

  async remove(id: string): Promise<Task> {
    await this.findOne(id);

    return this.tasksRepository.delete(id);
  }
}
