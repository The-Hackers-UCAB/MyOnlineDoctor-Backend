import { Logger } from "@nestjs/common";
import { ILogger } from "../../../core/application/logging-handler/logger.interface";

export class NestLogger implements ILogger {
    log(origin: string, message: string): void {
        Logger.verbose(
            "\x1b[33m[" + origin + "] " +
            "\x1b[36m" + message
        );
    }
}