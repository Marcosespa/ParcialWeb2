/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  NotFoundException,
  BadRequestException,
  PreconditionFailedException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { BusinessError } from '../errors/business-errors';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.type === BusinessError.NOT_FOUND) {
          throw new NotFoundException(error.message);
        } else if (error.type === BusinessError.PRECONDITION_FAILED) {
          throw new PreconditionFailedException(error.message);
        } else if (error.type === BusinessError.BAD_REQUEST) {
          throw new BadRequestException(error.message);
        }
        throw error;
      }),
    );
  }
}
