import { Injectable } from "@nestjs/common";
import { SessionDto } from "../sessions/dtos/session.dto";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passReqToCallback: true,
        });
    }

    async validate(request: Request, email: string, password: string): Promise<SessionDto> {
        const userDto = await this.authService.validateUser(email, password);

        //Verificar que el Doctor o Paciente no esté bloqueado.

        return { userId: userDto.id, userIpAddress: this.ipAddress(request) };
    }

    private ipAddress(request: any): string {
        let ipAddress = request['connection']['remoteAddress'];

        if (ipAddress.substr(0, 7) == "::ffff:") {
            ipAddress = ipAddress.substr(7);
        }
        return ipAddress;
    }
}