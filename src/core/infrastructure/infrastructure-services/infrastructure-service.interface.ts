import { Result } from "../../application/result-handler/result";

/** IInfrastructureService: Es una interfaz genérica utilizada para implementar servicios de infraestructura.
 *  @typeParam `D` Tipo parametrizado de los DTOs.
 *  @typeParam `R` Tipo parametrizado del resultado.*/
export interface IInfrastructureService<D, R> {
    /**Ejecuta el servicio de infraestructura.
     * @param dto Datos de entrada del servicio de infraestructura.*/
    execute(dto: D): Promise<Result<R>>;
}