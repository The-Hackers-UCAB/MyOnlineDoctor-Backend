import { HttpService } from "@nestjs/axios";
import { InternalServerErrorException } from "@nestjs/common";
import { UUIDGenerator } from "../uuid/uuid-generator";
import { tap } from "rxjs";

/**AgoraApiTokenGenerator: Es una clase de infraestructura que genera un nuevo token para videollamadas con agora.*/
export class AgoraApiTokenGenerator {
    private readonly uuidGenerator: UUIDGenerator = new UUIDGenerator();

    constructor(private readonly httpService: HttpService) { }

    /**Genera un token de agora de forma aleatoria para los chatrooms.
     * @returns Retorna un token aleatorio.*/
    async generateCallToken(): Promise<string> {
        const uuid = this.uuidGenerator.generate();

        const response = await this.httpService.get(process.env.AGORA_URL.replace("${name}", uuid)).pipe(
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