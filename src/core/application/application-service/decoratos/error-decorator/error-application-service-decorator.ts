import { DomainException } from "src/core/domain/exceptions/domain.exception";
import { Result } from "../../../result-handler/result";
import { ApplicationServiceDecorator } from "../application-service.decorator";

/**ErrorApplicationServiceDecorator es un decorador de servicio de aplicación utilizado para el manejo de las excepciones de dominio.*/
export class ErrorApplicationServiceDecorator<D, R> extends ApplicationServiceDecorator<D, R>{
    async execute(dto: D): Promise<Result<R>> {
        try {
            return await super.execute(dto);
        } catch (error) {
            if (error.constructor.prototype instanceof DomainException) {
                const domainError: DomainException = error as DomainException;
                const result = Result.fail<R>(domainError);
                return result;
            }
            else {
                throw error;
            }
        }
    }
}