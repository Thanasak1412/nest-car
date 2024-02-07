import { Request, Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    // Get the response object from the arguments host
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Get the quest object from the argument host
    const request = ctx.getRequest<Request>();

    // Get the status code from the exception
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception.message ||
        exception.getResponse()['message'] ||
        'Internal Server Error',
    };

    // Send a JSON response using the response object
    response.status(status).json(responseBody);
  }
}
