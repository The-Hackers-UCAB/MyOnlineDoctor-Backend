import { HttpService } from "@nestjs/axios";
import { InternalServerErrorException } from "@nestjs/common";
import { tap } from "rxjs";

/**AgoraApiTokenGenerator: Es una clase de infraestructura que genera un nuevo token para videollamadas con agora.*/
export class AgoraApiTokenGenerator {

    constructor(private readonly httpService: HttpService) { }

    /**Genera un token de agora de forma aleatoria para los chatrooms.
     * @param channelName Nombre del canal.
     * @returns Retorna un token aleatorio.*/
    async generateCallToken(channelName: string): Promise<string> {
        const response = await this.httpService.get(process.env.AGORA_URL.replace("${name}", channelName)).pipe(
            tap({
                next: (response) => {
                    return response?.data?.rtcToken ? response.data.rtcToken : "";
                },
                error: (error) => {
                    throw new InternalServerErrorException(error.message);
                }
            })
        ).toPromise();

        return response.data.rtcToken;
    }
}