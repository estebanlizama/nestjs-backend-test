import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async findAll(filterDto: GetTasksFilterDto) {
    const { status, priority } = filterDto;
    
    return this.prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id); // Ensure task exists before updating

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async updateStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: { status: updateTaskStatusDto.status },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure task exists before deleting

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
