import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { InvalidSessionException } from "src/security/auth/sessions/exceptions/invalid.session.exception";

export const GetDoctorId = createParamDecorator(
    (_data, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if (!request.user) throw new InvalidSessionException();
        return request.user.doctorId;
    }
);