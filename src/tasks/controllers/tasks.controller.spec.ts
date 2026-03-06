import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { TasksController } from './tasks.controller';
import { TasksService } from '../services/tasks.service';

const mockTask = {
  id: 'uuid-1',
  title: 'Test Task',
  description: 'Test description',
  status: TaskStatus.PENDING,
  priority: TaskPriority.MEDIUM,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTasksService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  remove: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created task', async () => {
      const dto = { title: 'New Task', description: 'Desc' };
      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(dto as any);

      expect(mockTasksService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      mockTasksService.findAll.mockResolvedValue([mockTask]);

      const result = await controller.findAll({});

      expect(mockTasksService.findAll).toHaveBeenCalledWith({});
      expect(result).toHaveLength(1);
    });

    it('should pass filter dto to service', async () => {
      const filter = { status: TaskStatus.PENDING };
      mockTasksService.findAll.mockResolvedValue([mockTask]);

      await controller.findAll(filter as any);

      expect(mockTasksService.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne('uuid-1');

      expect(mockTasksService.findOne).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockTask);
    });

    it('should propagate NotFoundException from service', async () => {
      mockTasksService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      const dto = { title: 'Updated' };
      const updated = { ...mockTask, title: 'Updated' };
      mockTasksService.update.mockResolvedValue(updated);

      const result = await controller.update('uuid-1', dto as any);

      expect(mockTasksService.update).toHaveBeenCalledWith('uuid-1', dto);
      expect(result.title).toBe('Updated');
    });
  });

  describe('updateStatus', () => {
    it('should update status and return the task', async () => {
      const dto = { status: TaskStatus.IN_PROGRESS };
      const updated = { ...mockTask, status: TaskStatus.IN_PROGRESS };
      mockTasksService.updateStatus.mockResolvedValue(updated);

      const result = await controller.updateStatus('uuid-1', dto);

      expect(mockTasksService.updateStatus).toHaveBeenCalledWith('uuid-1', dto);
      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    });
  });

  describe('remove', () => {
    it('should delete and return the task', async () => {
      mockTasksService.remove.mockResolvedValue(mockTask);

      const result = await controller.remove('uuid-1');

      expect(mockTasksService.remove).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockTask);
    });

    it('should propagate NotFoundException from service', async () => {
      mockTasksService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
