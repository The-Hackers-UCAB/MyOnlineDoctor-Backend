/** IDomainService: Es una interfaz genérica utilizada para implementar servicios de dominio.
 *  @typeParam `D` Tipo parametrizado de los DTOs.
 *  @typeParam `R` Tipo parametrizado del resultado.*/
export interface IDomainService<D, R> {
    /**Ejecuta el servicio de dominio.
     * @param dto Datos de entrada del servicio de dominio.*/
    execute(dto: D): R;
}