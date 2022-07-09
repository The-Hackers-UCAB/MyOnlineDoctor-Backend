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

        //Verificar que el usuario no este bloqueado

        return { userId: userDto.id };
    }
}