import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { OrmMedicalRecordRepository } from "../repositories/orm-medical-record.repository";
import { OrmPatientRepository } from "../../../patient/infrastructure/repositories/orm-patient.repository";
import { OrmAppointmentRepository } from "../../../appointment/infrastructure/repositories/orm-appointment.repository";
import { OrmDoctorRepository } from "../../../doctor/infrastructure/repositories/orm-doctor.repository";
import { EntityManager } from "typeorm";
import { CreateMedicalRecordApplicationService, CreateMedicalRecordApplicationServiceDto } from "../../../medical-record/application/services/create-medical-record.aplication.service";
import { Result } from "../../../core/application/result-handler/result";
import { UUIDGenerator } from "../../../core/infrastructure/uuid/uuid-generator";
import { EventBus } from "../../../core/infrastructure/event-handler/event-bus";
import { ErrorApplicationServiceDecorator } from "../../../core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "../../../core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NestLogger } from "../../../core/infrastructure/logger/nest-logger";
import { SessionGuard } from "../../../core/infrastructure/security/auth/sessions/session.guard";
import { GetDoctorId } from "../../../core/infrastructure/security/users/decorators/get-doctor-id.decortator";
import { Role } from "../../../core/infrastructure/security/users/roles/role.entity.enum";
import { Roles } from "../../../core/infrastructure/security/users/roles/roles.decorator";
import { RolesGuard } from "../../../core/infrastructure/security/users/roles/roles.guard";

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