import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  error?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request.url);
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(exception: unknown, path: string): ErrorResponse {
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return {
        statusCode: status,
        timestamp,
        path,
        message:
          typeof exceptionResponse === 'object' &&
          'message' in (exceptionResponse as Record<string, unknown>)
            ? (exceptionResponse as Record<string, unknown>).message as string | string[]
            : exception.message,
        error:
          typeof exceptionResponse === 'object' &&
          'error' in (exceptionResponse as Record<string, unknown>)
            ? (exceptionResponse as Record<string, unknown>).error as string
            : undefined,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.mapPrismaError(exception, timestamp, path);
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp,
      path,
      message: 'Internal server error',
    };
  }

  private mapPrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
    timestamp: string,
    path: string,
  ): ErrorResponse {
    const prismaErrorMap: Record<string, { status: number; message: string }> = {
      P2002: { status: HttpStatus.CONFLICT, message: 'A record with this data already exists.' },
      P2025: { status: HttpStatus.NOT_FOUND, message: 'The requested record was not found.' },
      P2003: { status: HttpStatus.BAD_REQUEST, message: 'Related record not found.' },
    };

    const mapped = prismaErrorMap[exception.code] ?? {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'A database error occurred.',
    };

    return {
      statusCode: mapped.status,
      timestamp,
      path,
      message: mapped.message,
    };
  }
}
