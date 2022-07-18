import { CallHandler, ExecutionContext, ForbiddenException, InternalServerErrorException, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class ExceptionInterceptor implements NestInterceptor {
    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<Error> {
        return next.handle().pipe(
            tap({
                next: (val) => {
                    if (val?.error) {
                        throw new InternalServerErrorException(val.message, val.error);
                    }
                },
                error: (error) => {
                    if (error?.status && error?.status === 401) {
                        throw new UnauthorizedException(error.message);
                    }
                    else if (error?.status && error?.status === 403) {
                        throw new ForbiddenException(error.message);
                    }
                    else {
                        throw new InternalServerErrorException(error.message);
                    }
                }
            }),
        );
    }
}