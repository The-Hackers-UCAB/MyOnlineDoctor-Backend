import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { OrmMedicalRecordRepository } from "../repositories/orm-medical-record.repository";
import { OrmPatientRepository } from "../../../patient/infrastructure/repositories/orm-patient.repository";
import { OrmAppointmentRepository } from "../../../appointment/infrastructure/repositories/orm-appointment.repository";
import { OrmDoctorRepository } from "../../../doctor/infrastructure/repositories/orm-doctor.repository";
import { EntityManager } from "typeorm";
import { UUIDGenerator } from "../../../core/infrastructure/uuid/uuid-generator";
import { Role } from "src/core/infrastructure/security/users/roles/role.entity.enum";
import { RolesGuard } from "src/core/infrastructure/security/users/roles/roles.guard";
import { SessionGuard } from "src/core/infrastructure/security/auth/sessions/session.guard";
import { GetDoctorId } from "src/core/infrastructure/security/users/decorators/get-doctor-id.decortator";
import { identity } from "rxjs";
import { Roles } from "src/core/infrastructure/security/users/roles/roles.decorator";
import { EventBus } from "src/core/infrastructure/event-handler/event-bus";
import { UpdateDescriptionMedicalRecordApplicationService, UpdateDescriptionMedicalRecordApplicationServiceDto } from "src/medical-record/application/services/update-description-medical-record.application.service";
import { ErrorApplicationServiceDecorator } from "src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NestLogger } from "src/core/infrastructure/logger/nest-logger";
import { UpdateDiagnosticMedicalRecordApplicationServiceDto , UpdateDiagnosticMedicalRecordApplicationService} from "src/medical-record/application/services/update-diagnostic-medical-record.application.service";
import { Result } from "src/core/application/result-handler/result";


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

    @Post('modify-description')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async modifyDescription( @GetDoctorId() id, @Body() dto: UpdateDescriptionMedicalRecordApplicationServiceDto): Promise<Result<string>> {
        dto.doctorId = id;

        const eventBus = EventBus.getInstance();
        //TODO Implementar la notificacion de un cambio en el registro medico
        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new UpdateDescriptionMedicalRecordApplicationService(this.ormMedicalRecordRepository, this.ormDoctorRepository,eventBus),
                new NestLogger()
            )
        );
        return await service.execute(dto);
    }

    @Post('modify-diagnostic')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async modifyDiagnostic( @GetDoctorId() id, @Body() dto: UpdateDiagnosticMedicalRecordApplicationServiceDto): Promise<Result<string>> {
        
        dto.doctorId = id;

        const eventBus = EventBus.getInstance();
        //TODO Implementar la notificacion de un cambio en el registro medico
        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new UpdateDiagnosticMedicalRecordApplicationService(this.ormMedicalRecordRepository, this.ormDoctorRepository,eventBus),
                new NestLogger()
            )
        );
        return await service.execute(dto);

    }
}