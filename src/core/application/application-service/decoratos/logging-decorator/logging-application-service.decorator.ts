import { ILogger } from "../../../logging-handler/logger.interface";
import { Result } from "../../../result-handler/result";
import { IApplicationService } from "../../application-service.interface";
import { ApplicationServiceDecorator } from "../application-service.decorator";

/**LoggingApplicationServiceDecorator es un decorador de servicio de aplicación utilizado para el logging de los servicios.*/
export class LoggingApplicationServiceDecorator<D, R> extends ApplicationServiceDecorator<D, R>{
    private readonly logger: ILogger;

    constructor(applicationService: IApplicationService<D, R>, logger: ILogger) {
        super(applicationService);
        this.logger = logger;
    }

    async execute(dto: D): Promise<Result<R>> {
        this.logger.log(
            this.constructor.name,
            this.applicationService.name + " - Data: {" + JSON.stringify(dto) + "}"
        );
        return await super.execute(dto);
    }
}
