import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { GetDoctorId } from '../users/decorators/get-doctor-id.decortator';
import { GetPatientId } from '../users/decorators/get-patient-id.decorator';
import { GetUserId } from '../users/decorators/get-user-id.decorator';
import { Role } from '../users/roles/role.entity.enum';
import { Roles } from '../users/roles/roles.decorator';
import { RolesGuard } from '../users/roles/roles.guard';
import { SessionGuard } from './sessions/session.guard';
import { LocalAuthGuard } from './strategies/local.auth.guard';

/** AuthController: Controller de infraestructura encargado de gestionar las peticiones relacionadas con el módulo de seguridad.*/
@Controller('auth')
export class AuthController {
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() request): Promise<{ msg: string }> {
        return { msg: "Sesión iniciada!" };
    }

    @Get('logout')
    @UseGuards(SessionGuard)
    async logout(@Request() request): Promise<{ msg: string }> {
        request.session.destroy();
        return { msg: "Sessión cerrada!" };
    }

    @Get('protected')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async protectefFunction(@GetUserId() userId, @GetPatientId() patientId, @GetDoctorId() doctorId): Promise<{ msg: string }> {
        return { msg: "Patient Id " + patientId }
    }
}
