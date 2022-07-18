import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { OrmMedicalRecordRepository } from "../repositories/orm-medical-record.repository";
import { OrmPatientRepository } from "src/patient/infrastructure/repositories/orm-patient.repository";
import { OrmAppointmentRepository } from "src/appointment/infrastructure/repositories/orm-appointment.repository";
import { OrmDoctorRepository } from "src/doctor/infrastructure/repositories/orm-doctor.repository";
import { EntityManager } from "typeorm";
import { Roles } from "src/security/users/roles/roles.decorator";
import { Role } from "src/security/users/roles/role.entity.enum";
import { RolesGuard } from "src/security/users/roles/roles.guard";
import { SessionGuard } from "src/security/auth/sessions/session.guard";
import { GetDoctorId } from "src/security/users/decorators/get-doctor-id.decortator";
import { CreateMedicalRecordApplicationService, CreateMedicalRecordApplicationServiceDto } from "src/medical-record/application/services/create-medical-record.aplication.service";
import { Result } from "src/core/application/result-handler/result";
import { UUIDGenerator } from "src/core/infrastructure/uuid/uuid-generator";
import { EventBus } from "src/core/infrastructure/event-handler/event-bus";
import { ErrorApplicationServiceDecorator } from "src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NestLogger } from "src/core/infrastructure/logger/nest-logger";

@Controller('medical-record')
export class MedicalRecordController {

    private readonly ormPatientRepository: OrmPatientRepository;
    private readonly ormAppointmentRepository: OrmAppointmentRepository;
    private readonly ormDoctorRepository: OrmDoctorRepository;
    private readonly ormMedicalRecordRepository: OrmMedicalRecordRepository;
    private readonly uuidGenerator: UUIDGenerator = new UUIDGenerator();

    constructor(private readonly manager: EntityManager) {
        if (!manager) { throw new Error("Entity manager can't be null"); }
        this.ormPatientRepository = this.manager.getCustomRepository(OrmPatientRepository);
        this.ormAppointmentRepository = this.manager.getCustomRepository(OrmAppointmentRepository);
        this.ormDoctorRepository = this.manager.getCustomRepository(OrmDoctorRepository);
        this.ormMedicalRecordRepository = this.manager.getCustomRepository(OrmMedicalRecordRepository);
    }

    @Post('')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async createMedicalRecord(@GetDoctorId() id, @Body() dto: CreateMedicalRecordApplicationServiceDto): Promise<Result<string>> {
        dto.doctorId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new CreateMedicalRecordApplicationService(
                    this.ormMedicalRecordRepository,
                    this.ormPatientRepository,
                    this.ormDoctorRepository,
                    this.ormAppointmentRepository,
                    this.uuidGenerator,
                    eventBus),
                new NestLogger()
            )
        );

        return await service.execute(dto);
    }
}