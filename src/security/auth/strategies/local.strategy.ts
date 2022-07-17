import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SessionDto } from "../sessions/dtos/session.dto";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy } from "passport-local";
import { Role } from "src/security/users/roles/role.entity.enum";
import { DoctorStatusEnum } from "src/doctor/domain/value-objects/doctor-status.enum";
import { PatientStatusEnum } from "src/patient/domain/value-objects/patient-status.enum";

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

        if (userDto.role == Role.Doctor) {
            if (userDto.doctor.status == DoctorStatusEnum.BLOCKED || userDto.doctor.status == DoctorStatusEnum.DELETED) {
                throw new UnauthorizedException("Doctor eliminado o bloqueado.")
            }
        }
        else if (userDto.role == Role.Patient) {
            if (userDto.patient.status == PatientStatusEnum.BLOCKED || userDto.patient.status == PatientStatusEnum.DELETED) {
                throw new UnauthorizedException("Paciente eliminado o bloqueado.")
            }
        }

        return { userId: userDto.id, userRole: userDto.role, userIpAddress: this.ipAddress(request), doctorId: userDto.doctor?.id, patientId: userDto.patient?.id };
    }

    private ipAddress(request: any): string {
        let ipAddress = request['connection']['remoteAddress'];

        if (ipAddress.substr(0, 7) == "::ffff:") {
            ipAddress = ipAddress.substr(7);
        }
        return ipAddress;
    }
}