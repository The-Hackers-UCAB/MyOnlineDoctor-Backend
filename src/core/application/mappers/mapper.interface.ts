/**IMapper: es una interfaz genérica utilizada para hacer map entre objetos de dominio y otros cualquiera.
*  @typeParam `D` Tipo parametrizado del objeto de dominio.
*  @typeParam `O` Tipo parametrizado del objeto.*/
export interface IMapper<D, O> {
    /**Transforma un objeto de dominio a un objeto cualquiera.
     * @param domain Objeto del dominio.*/
    fromDomainToOther(domain: D): O;

    /**Transforma un objeto cualquiera a un objeto de dominio.
    * @param other Objecto de tipo O.*/
    fromOtherToDomain(other: O): D;
}