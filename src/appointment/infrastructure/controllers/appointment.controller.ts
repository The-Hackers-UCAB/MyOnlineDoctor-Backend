import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { RequestAppointmentApplicationService, RequestAppointmentApplicationServiceRequest } from "src/appointment/application/services/request-appointment.application.service";
import { ErrorApplicationServiceDecorator } from "src/core/application/application-service/decoratos/error-decorator/error-application-service.decorator";
import { LoggingApplicationServiceDecorator } from "src/core/application/application-service/decoratos/logging-decorator/logging-application-service.decorator";
import { Result } from "src/core/application/result-handler/result";
import { EventBus } from "src/core/infrastructure/event-handler/event-bus";
import { NestLogger } from "src/core/infrastructure/logger/nest-logger";
import { UUIDGenerator } from "src/core/infrastructure/uuid/uuid-generator";
import { OrmDoctorRepository } from "src/doctor/infrastructure/repositories/orm-doctor.repository";
import { OrmPatientRepository } from "src/patient/infrastructure/repositories/orm-patient.repository";
import { SessionGuard } from "src/security/auth/sessions/session.guard";
import { GetPatientId } from "src/security/users/decorators/get-patient-id.decorator";
import { Role } from "src/security/users/roles/role.entity.enum";
import { Roles } from "src/security/users/roles/roles.decorator";
import { RolesGuard } from "src/security/users/roles/roles.guard";
import { EntityManager } from "typeorm";
import { OrmAppointmentRepository } from "../repositories/orm-appointment.repository";

@Controller('appointment')
export class AppointmentController {

    private readonly ormPatientRepository: OrmPatientRepository;
    private readonly ormAppointmentRepository: OrmAppointmentRepository;
    private readonly ormDoctorRepository: OrmDoctorRepository;

    constructor(private readonly manager: EntityManager) {
        if (!manager) { throw new Error("Entity manager can't be null"); }
        this.ormPatientRepository = this.manager.getCustomRepository(OrmPatientRepository);
        this.ormAppointmentRepository = this.manager.getCustomRepository(OrmAppointmentRepository);
        this.ormDoctorRepository = this.manager.getCustomRepository(OrmDoctorRepository);
    }


    @Post('')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async requestAppointment(@GetPatientId() id, @Body() requestAppointmentApplicationServiceRequest: RequestAppointmentApplicationServiceRequest): Promise<Result<string>> {
        requestAppointmentApplicationServiceRequest.patientId = id;
        requestAppointmentApplicationServiceRequest.id = UUIDGenerator.generate();

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new RequestAppointmentApplicationService(this.ormAppointmentRepository, this.ormPatientRepository, this.ormDoctorRepository, eventBus),
                new NestLogger()
            )
        );

        return await service.execute(requestAppointmentApplicationServiceRequest);
    }
}