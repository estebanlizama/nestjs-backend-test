import { IsString, IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(150)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}
