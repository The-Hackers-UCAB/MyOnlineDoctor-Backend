import { ICommandService } from "../../services/command-service.interface";

export abstract class CommandServiceDecorator<T> implements ICommandService<T>{
    private readonly service: ICommandService<T>;

    constructor(service: ICommandService<T>) {
        this.service = service;
    }

    async execute(dto: T): Promise<void> {
        return this.service.execute(dto);
    }
}