import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { TasksService } from './tasks.service';
import { TasksRepository } from '../repositories/tasks.repository';

const mockTask = {
  id: 'uuid-1',
  title: 'Test Task',
  description: 'Test description',
  status: TaskStatus.PENDING,
  priority: TaskPriority.MEDIUM,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTasksRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: mockTasksRepository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a task', async () => {
      const dto = { title: 'New Task', description: 'Description' };
      mockTasksRepository.create.mockResolvedValue(mockTask);

      const result = await service.create(dto as any);

      expect(mockTasksRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks without filters', async () => {
      mockTasksRepository.findAll.mockResolvedValue([mockTask]);

      const result = await service.findAll({});

      expect(mockTasksRepository.findAll).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toHaveLength(1);
    });

    it('should pass status and priority filters to the repository', async () => {
      mockTasksRepository.findAll.mockResolvedValue([mockTask]);

      await service.findAll({ status: TaskStatus.PENDING, priority: TaskPriority.HIGH });

      expect(mockTasksRepository.findAll).toHaveBeenCalledWith(
        TaskStatus.PENDING,
        TaskPriority.HIGH,
      );
    });
  });

  describe('findOne', () => {
    it('should return a task when it exists', async () => {
      mockTasksRepository.findById.mockResolvedValue(mockTask);

      const result = await service.findOne('uuid-1');

      expect(mockTasksRepository.findById).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTasksRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('not-found-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      const dto = { title: 'Updated Title' };
      const updated = { ...mockTask, title: 'Updated Title' };
      mockTasksRepository.findById.mockResolvedValue(mockTask);
      mockTasksRepository.update.mockResolvedValue(updated);

      const result = await service.update('uuid-1', dto as any);

      expect(mockTasksRepository.update).toHaveBeenCalledWith('uuid-1', dto);
      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundException when updating a non-existent task', async () => {
      mockTasksRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('not-found-id', { title: 'x' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a task', async () => {
      const updated = { ...mockTask, status: TaskStatus.DONE };
      mockTasksRepository.findById.mockResolvedValue(mockTask);
      mockTasksRepository.updateStatus.mockResolvedValue(updated);

      const result = await service.updateStatus('uuid-1', { status: TaskStatus.DONE });

      expect(mockTasksRepository.updateStatus).toHaveBeenCalledWith('uuid-1', TaskStatus.DONE);
      expect(result.status).toBe(TaskStatus.DONE);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTasksRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateStatus('not-found-id', { status: TaskStatus.DONE }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete and return the task', async () => {
      mockTasksRepository.findById.mockResolvedValue(mockTask);
      mockTasksRepository.delete.mockResolvedValue(mockTask);

      const result = await service.remove('uuid-1');

      expect(mockTasksRepository.delete).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTasksRepository.findById.mockResolvedValue(null);

      await expect(service.remove('not-found-id')).rejects.toThrow(NotFoundException);
    });
  });
});
