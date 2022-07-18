import { Result } from "../../result-handler/result";
import { IApplicationService } from "../application.service.interface";

/**ApplicationServiceDecorator: Es una clase abstracta genérica utilizada para implementar el patron decorador en los servicios de aplicación.*/
export abstract class ApplicationServiceDecorator<D, R> implements IApplicationService<D, R> {
    protected readonly applicationService: IApplicationService<D, R>;

    get name(): string {
        return this.applicationService.constructor.name;
    }

    constructor(applicationService: IApplicationService<D, R>) {
        if (applicationService == null) { throw new Error(this.constructor.name + ": " + this.constructor.name + " is null. "); }
        this.applicationService = applicationService;
    }

    async execute(dto: D): Promise<Result<R>> {
        return await this.applicationService.execute(dto);
    }
}