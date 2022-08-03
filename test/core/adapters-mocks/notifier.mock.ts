import { NotificationHandler } from "../../../src/core/application/notification-handlers/notification-handler";
import { Logger } from "@nestjs/common";

export interface NotifierDto {
    message: string;
}

export class NotifierMock<D> extends NotificationHandler<D, NotifierDto>{
    async send(data: D): Promise<void> {
        const payload: NotifierDto = await this.messageMapper(data);

        Logger.debug(
            "\x1b[33m[" + this.constructor.name + "] " +
            "\x1b[35m" + "Notificación Mock enviada con " + payload.message
        );
    }
}