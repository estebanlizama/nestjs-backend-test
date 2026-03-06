import { Injectable } from '@nestjs/common';
import { Task, TaskPriority, TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
      },
    });
  }

  findAll(status?: TaskStatus, priority?: TaskPriority): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateTaskDto): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: { ...dto },
    });
  }

  updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  delete(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
