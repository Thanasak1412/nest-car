import { Request, Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Get the response object from the arguments host
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Get the quest object from the argument host
    const request = ctx.getRequest<Request>();

    // Get the status code from the exception
    const status = exception.getStatus();

    // Send a JSON response using the response object
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception.message ||
        exception.getResponse()['message'] ||
        'Internal Server Error',
    });
  }
}
