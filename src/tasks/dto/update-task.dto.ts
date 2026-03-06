import { IsString, IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Updated title of the task',
    example: 'Implement refresh token flow',
    minLength: 3,
    maxLength: 150,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the task',
    example: 'Add refresh token endpoint and rotation logic',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated status of the task',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Updated priority of the task',
    enum: TaskPriority,
    example: TaskPriority.LOW,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}
