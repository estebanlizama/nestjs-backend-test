import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
