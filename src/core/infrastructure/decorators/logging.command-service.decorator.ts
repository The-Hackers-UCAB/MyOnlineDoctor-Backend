import { CommandServiceDecorator } from "./base/command-service.decorator";


export class LoggingCommandServiceDecorator<T> extends CommandServiceDecorator<T>{
    async execute(dto: T): Promise<void> {
        await super.execute(dto);
        console.log('Datos: ');
        console.log(dto);
    }
}
