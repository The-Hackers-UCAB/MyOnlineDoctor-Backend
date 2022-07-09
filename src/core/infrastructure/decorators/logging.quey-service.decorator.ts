import { QueryServiceDecorator } from "./base/query-service.decorator";

export class LoggingQueryServiceDecorator<T, E> extends QueryServiceDecorator<T, E>{
    async execute(dto: T): Promise<E> {
        const result: E = await super.execute(dto);
        console.log('Datos: ');
        console.log(dto);
        return result;
    }
}
