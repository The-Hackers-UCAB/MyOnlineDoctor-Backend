import { NotificationHandler } from "../../../notification-handlers/notification-handler";
import { Result } from "../../../../../core/application/result-handler/result";
import { IApplicationService } from "../../application.service.interface";
import { ApplicationServiceDecorator } from "../application.service.decorator";

/** NotifierApplicationServiceDecorator: Es un decorador para enviar notificaciones.*/
export class NotifierApplicationServiceDecorator<D, R, M> extends ApplicationServiceDecorator<D, R> {

    constructor(applicationService: IApplicationService<D, R>, private readonly notifier: NotificationHandler<D, M>) {
        super(applicationService);
    }

    async execute(dto: D): Promise<Result<R>> {
        const result = await super.execute(dto);
        await this.notifier.send(dto);
        return result;
    }
}