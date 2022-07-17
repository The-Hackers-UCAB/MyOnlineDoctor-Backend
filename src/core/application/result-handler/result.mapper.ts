import { Result } from "./result";

/**ResultMapper: Es un mapper que permite mapear un resultado a otro. */
export class ResultMapper {
    /**Permite mapear un resultado a otro.
     * @param result Resultado a mapear.
     * @param converter Función utilizada para mapear.
     * @returns Resultado con el nuevo valor mapeado.*/
    static async map<R, E>(result: Result<R>, converter: (value: R) => (Promise<E> | E)): Promise<Result<E>> {
        if (result.IsSuccess) {
            return Result.success(await converter(result.Value));
        }
        return Result.fail<E>(result.Error);
    }
}