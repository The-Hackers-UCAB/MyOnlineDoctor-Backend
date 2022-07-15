/**ILogger: Es una interfaz utilizada como adaptador para implementar logs.*/
export interface ILogger {
    /**Permite logguear información.
     * @param message DTO a logguear */
    log(origin: string, message: string): void;
}