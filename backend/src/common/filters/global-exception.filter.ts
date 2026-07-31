import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from '@nestjs/common';
import {
  EntityNotFoundError,
  EntityConflictError,
} from '../domain/domain-errors';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorDetails: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      errorDetails =
        typeof res === 'object' && res !== null && 'message' in res
          ? ((res as Record<string, unknown>).message as string | object)
          : res;
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      errorDetails = exception.message;
    } else if (exception instanceof EntityConflictError) {
      status = HttpStatus.CONFLICT;
      errorDetails = exception.message;
    }

    if (status === HttpStatus.NOT_FOUND) {
      this.logger.warn(
        `HTTP Status: 404 - Method: ${request.method} - Path: ${request.url} - ${
          exception instanceof Error ? exception.message : 'Not Found'
        }`,
      );
    } else {
      this.logger.error(
        `HTTP Status: ${status} - Method: ${request.method} - Path: ${request.url} - Error: ${
          exception instanceof Error
            ? exception.message
            : JSON.stringify(exception)
        }`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorDetails,
    });
  }
}
