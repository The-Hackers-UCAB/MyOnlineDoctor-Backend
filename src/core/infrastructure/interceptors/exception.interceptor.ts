import { CallHandler, ExecutionContext, ForbiddenException, InternalServerErrorException, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ExceptionInterceptor implements NestInterceptor {
    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<Error> {
        return next.handle().pipe(
            catchError(err => {
                if (err?.status && err?.status === 401) {
                    throw new UnauthorizedException(err.message);
                }
                else if (err?.status && err?.status === 403) {
                    throw new ForbiddenException(err.message);
                }
                else {
                    throw new InternalServerErrorException(err.message);
                }
            }),
        );
    }
}