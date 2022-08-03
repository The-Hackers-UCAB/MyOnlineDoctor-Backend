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
import { Roles } from "src/core/infrastructure/security/users/roles/roles.decorator";
import { EventBus } from "src/core/infrastructure/event-handler/event-bus";
import { UpdateDescriptionMedicalRecordApplicationService, UpdateDescriptionMedicalRecordApplicationServiceDto } from "src/medical-record/application/services/update-description-medical-record.application.service";
import { ErrorApplicationServiceDecorator } from "src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NestLogger } from "src/core/infrastructure/logger/nest-logger";
import { UpdateDiagnosticMedicalRecordApplicationServiceDto , UpdateDiagnosticMedicalRecordApplicationService} from "src/medical-record/application/services/update-diagnostic-medical-record.application.service";
import { Result } from "src/core/application/result-handler/result";
import { NotifierApplicationServiceDecorator } from "src/core/application/application-service/decoratos/notifier-decorator/notifier.application.service.decorator";
import { FirebaseNotifier } from "src/core/infrastructure/firebase-notifications/notifier/firebase-notifier";
import { MedicalRecordID } from "src/medical-record/domain/value-objects/medical-record-id";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { DoctorGenderEnum } from "src/doctor/domain/value-objects/doctor-gender.enum";
import { UpdateExamsMedicalRecordApplicationService, UpdateExamsMedicalRecordApplicationServiceDto } from "src/medical-record/application/services/update-exams-medical-record.application.service";
import { UpdateRecipeMedicalRecordApplicationService, UpdateRecipeMedicalRecordApplicationServiceDto } from "src/medical-record/application/services/update-recipe-medical-record.application.service";
import { UpdatePlanningMedicalRecordApplicationService, UpdatePlanningMedicalRecordApplicationServiceDto } from "src/medical-record/application/services/update-planning-medical-record.application.service";


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
        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new UpdateDescriptionMedicalRecordApplicationService(this.ormMedicalRecordRepository, this.ormDoctorRepository,eventBus),
                new NestLogger()
            ),
            new FirebaseNotifier(
                async (data: UpdateDescriptionMedicalRecordApplicationServiceDto) => {
                    const medicalRecord = await this.ormMedicalRecordRepository.findOneById(MedicalRecordID.create(data.id));
                    const doctor = await this.ormDoctorRepository.findOneById(DoctorId.create(data.doctorId));
                    return {
                        patientId: medicalRecord.Patient.Id,
                        message : {
                            title: "Cambio en el registro medico",
                            body: `${((doctor.Gender.Value == DoctorGenderEnum.MALE) ? 'El Dr.' : 'La Dra.')} ${doctor.Names.FirstName} ${doctor.Surnames.FirstSurname} ha cambiado la descripcion del registro medico`,
                            payload: ""
                        }
                 };   
                }
            )
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
            new NotifierApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new UpdateDiagnosticMedicalRecordApplicationService(this.ormMedicalRecordRepository, this.ormDoctorRepository,eventBus),
                new NestLogger()
            ),
            new FirebaseNotifier(
                async (data: UpdateDiagnosticMedicalRecordApplicationServiceDto) => {
                    const medicalRecord = await this.ormMedicalRecordRepository.findOneById(MedicalRecordID.create(data.id));
                    const doctor = await this.ormDoctorRepository.findOneById(DoctorId.create(data.doctorId));
                    return {
                        patientId: medicalRecord.Patient.Id,
                        message : {
                            title: "Cambio en el registro medico",
                            body: `${((doctor.Gender.Value == DoctorGenderEnum.MALE) ? 'El Dr.' : 'La Dra.')} ${doctor.Names.FirstName} ${doctor.Surnames.FirstSurname} ha cambiado el diagnostico del registro medico`,
                            payload: ""
                        }
                 };   
                }
            )
            )
        );
        return await service.execute(dto);

    }

    @Post('modify-exams')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async modifyExams( @GetDoctorId() id, @Body() dto: UpdateExamsMedicalRecordApplicationServiceDto): Promise<Result<string>> {
        
        dto.doctorId = id;

        const eventBus = EventBus.getInstance();
        //TODO Implementar la notificacion de un cambio en el registro medico
        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new UpdateExamsMedicalRecordApplicationService(this.ormMedicalRecordRepository, this.ormDoctorRepository,eventBus),
                new NestLogger()
            ),
            new FirebaseNotifier(
                async (data: UpdateExamsMedicalRecordApplicationServiceDto) => {
                    const medicalRecord = await this.ormMedicalRecordRepository.findOneById(MedicalRecordID.create(data.id));
                    const doctor = await this.ormDoctorRepository.findOneById(DoctorId.create(data.doctorId));
                    return {
                        patientId: medicalRecord.Patient.Id,
                        message : {
                            title: "Cambio en el registro medico",
                            body: `${((doctor.Gender.Value == DoctorGenderEnum.MALE) ? 'El Dr.' : 'La Dra.')} ${doctor.Names.FirstName} ${doctor.Surnames.FirstSurname} ha cambiado los examenes del registro medico`, 
                            payload: ''
                        }
                    };
                }
            )
            )
        );
        return await service.execute(dto);
    }

    @Post('modify-recipe')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async modifyRecipe( @GetDoctorId() id, @Body() dto: UpdateRecipeMedicalRecordApplicationServiceDto): Promise<Result<string>>{

        dto.doctorId = id;

        const eventBus = EventBus.getInstance();
        
        //TODO Implementar la notificacion de un cambio en el registro medico

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new UpdateRecipeMedicalRecordApplicationService(this.ormMedicalRecordRepository, this.ormDoctorRepository, eventBus),
                new NestLogger()
            ),
            new FirebaseNotifier(
                async (data: UpdateRecipeMedicalRecordApplicationServiceDto) =>{
                    const medicalRecord = await this.ormMedicalRecordRepository.findOneById(MedicalRecordID.create(data.id));
                    const doctor = await this.ormDoctorRepository.findOneById(DoctorId.create(data.doctorId));
                    return{
                        patientId: medicalRecord.Patient.Id,
                        message: {
                            title: "Cambio en el registro medico",
                            body: `${((doctor.Gender.Value == DoctorGenderEnum.MALE) ? 'El Dr.' : 'La Dra.')} ${doctor.Names.FirstName} ${doctor.Surnames.FirstSurname} ha cambiado los recipes del registro medico`, 
                            payload: ''
                        }
                    };
                }
            )
            )
        );

        return await service.execute(dto);

    }

    @Post('modify-planning')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async modifyPlanning( @GetDoctorId() id, @Body() dto: UpdatePlanningMedicalRecordApplicationServiceDto): Promise<Result<string>>{

        dto.doctorId = id;

        const eventBus = EventBus.getInstance();
        
        //TODO Implementar la notificacion de un cambio en el registro medico

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new UpdatePlanningMedicalRecordApplicationService(this.ormMedicalRecordRepository, this.ormDoctorRepository, eventBus),
                new NestLogger()
            ),
            new FirebaseNotifier(
                async (data: UpdatePlanningMedicalRecordApplicationServiceDto) =>{
                    const medicalRecord = await this.ormMedicalRecordRepository.findOneById(MedicalRecordID.create(data.id));
                    const doctor = await this.ormDoctorRepository.findOneById(DoctorId.create(data.doctorId));
                    return{
                        patientId: medicalRecord.Patient.Id,
                        message: {
                            title: "Cambio en el registro medico",
                            body: `${((doctor.Gender.Value == DoctorGenderEnum.MALE) ? 'El Dr.' : 'La Dra.')} ${doctor.Names.FirstName} ${doctor.Surnames.FirstSurname} ha cambiado la planificacion del registro medico`, 
                            payload: ''
                        }
                    };
                }
            )
            )
        );

        return await service.execute(dto);

    }
}