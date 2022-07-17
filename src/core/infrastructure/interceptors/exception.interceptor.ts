import { CallHandler, ExecutionContext, InternalServerErrorException, NestInterceptor, } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ExceptionInterceptor implements NestInterceptor {
    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<Error> {
        return next.handle().pipe(
            catchError(err => {
                throw new InternalServerErrorException(err.message);
            }),
        );
    }
}