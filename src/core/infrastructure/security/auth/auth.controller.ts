import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Result } from '../../../../../src/core/application/result-handler/result';
import { DoctorStatusEnum } from '../../../../../src/doctor/domain/value-objects/doctor-status.enum';
import { OrmDoctorRepository } from '../../../../../src/doctor/infrastructure/repositories/orm-doctor.repository';
import { PatientStatusEnum } from '../../../../../src/patient/domain/value-objects/patient-status.enum';
import { OrmPatientRepository } from '../../../../../src/patient/infrastructure/repositories/orm-patient.repository';
import { getManager } from 'typeorm';
import { UsersRepository } from '../users/repositories/users.repository';
import { Role } from '../users/roles/role.entity.enum';
import { Roles } from '../users/roles/roles.decorator';
import { RolesGuard } from '../users/roles/roles.guard';
import { SessionsRepository } from './sessions/repositories/session.repository';
import { SessionGuard } from './sessions/session.guard';
import { LocalAuthGuard } from './strategies/local.auth.guard';

/** AuthController: Controller de infraestructura encargado de gestionar las peticiones relacionadas con el módulo de seguridad.*/
@Controller('auth')
export class AuthController {
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() request): Promise<{ value: string }> {
        return { value: "Sesión iniciada." };
    }

    @Get('logout')
    @UseGuards(SessionGuard)
    async logout(@Request() request): Promise<{ value: string }> {
        request.session.destroy();
        return { value: "Sessión cerrada." };
    }


    @Post('block')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async blockPatient(@Body() dto: { id: number }): Promise<Result<string>> {
        const usersRepository = await getManager().getCustomRepository(UsersRepository);
        const sessionsRepository = await getManager().getCustomRepository(SessionsRepository)

        const user = await usersRepository.findOneById(dto.id);

        const sessions = await user.sessions;

        for await (const session of sessions) {
            await sessionsRepository.delete({ id: session.id });
        }

        if (user.role == Role.PATIENT) {
            const ormPatientRepository = await getManager().getCustomRepository(OrmPatientRepository);
            await ormPatientRepository.update({ id: user.patientId }, { status: PatientStatusEnum.BLOCKED });
        }
        else if (user.role == Role.DOCTOR) {
            const ormDoctorRepository = await getManager().getCustomRepository(OrmDoctorRepository);
            await ormDoctorRepository.update({ id: user.doctorId }, { status: DoctorStatusEnum.BLOCKED });
        }

        return Result.success("Usuario bloquedo.");
    }
}
