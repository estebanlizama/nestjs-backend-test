import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, status, priority } = createTaskDto;

    return this.prisma.task.create({
      data: {
        title,
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
      },
    });
  }

  async findAll(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, priority } = filterDto;

    return this.prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: { ...updateTaskDto },
    });
  }

  async updateStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: { status: updateTaskStatusDto.status },
    });
  }

  async remove(id: string): Promise<Task> {
    await this.findOne(id);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
