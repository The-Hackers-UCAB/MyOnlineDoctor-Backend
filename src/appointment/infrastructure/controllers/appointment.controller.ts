import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { RequestAppointmentApplicationService, RequestAppointmentApplicationServiceDto } from "../../../appointment/application/services/request-appointment.application.service";
import { ScheduleAppointmentApplicationService, ScheduleAppointmentApplicationServiceDto } from "../../../appointment/application/services/schedule-appointment.application.service";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { ErrorApplicationServiceDecorator } from "../../../core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "../../../core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NotifierApplicationServiceDecorator } from "../../../core/application/application-service/decoratos/notifier-decorator/notifier.application.service.decorator";
import { Result } from "../../../core/application/result-handler/result";
import { EventBus } from "../../../core/infrastructure/event-handler/event-bus";
import { NestLogger } from "../../../core/infrastructure/logger/nest-logger";
import { UUIDGenerator } from "../../../core/infrastructure/uuid/uuid-generator";
import { DoctorGenderEnum } from "../../../doctor/domain/value-objects/doctor-gender.enum";
import { OrmDoctorRepository } from "../../../doctor/infrastructure/repositories/orm-doctor.repository";
import { OrmPatientRepository } from "../../../patient/infrastructure/repositories/orm-patient.repository";
import { OrmAppointmentRepository } from "../repositories/orm-appointment.repository";
import { EntityManager } from "typeorm";
import { FirebaseNotifier } from "../../../core/infrastructure/firebase-notifications/notifier/firebase-notifier";
import { RejectPatientAppointmentApplicationService, RejectPatientAppointmentApplicationServiceDto } from "../../../appointment/application/services/reject-patient-appointment.application.service";
import { RejectDoctorAppointmentApplicationService, RejectDoctorAppointmentApplicationServiceDto } from "../../../appointment/application/services/reject-doctor-appointment.application.service";
import { AgoraApiTokenGenerator } from "../../../core/infrastructure/agora-api/agora-api";
import { HttpService } from "@nestjs/axios";
import { InitiateAppointmentCallApplicationService, InitiateAppointmentCallApplicationServiceDto } from "../../../appointment/application/services/initiate-appointment-call.application.service";
import { ResultMapper } from "../../../core/application/result-handler/result.mapper";
import { AcceptPatientAppointmentApplicationService, AcceptPatientAppointmentApplicationServiceDto } from "../../../appointment/application/services/accept-patient-appointment.application.service";
import { CancelPatientAppointmentApplicationService, CancelPatientAppointmentApplicationServiceDto } from "../../../appointment/application/services/cancel-patient-appointment.application.service";
import { CancelDoctorAppointmentApplicationService, CancelDoctorAppointmentApplicationServiceDto } from "../../../appointment/application/services/cancel-doctor-appointment.application.service";
import { RateAppointmentApplicationService, RateAppointmentApplicationServiceDto } from "../../../appointment/application/services/rate-appointment.application.service";
import { AppointmentRated } from "../../../appointment/domain/events/appointment-rated";
import { UpdateDoctorRatingApplicationService } from "../../../doctor/application/services/update-doctor-rating.application.service";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { InitiateAppointmentApplicationServiceDto, InitiateAppointmentApplicationService } from "../../../appointment/application/services/iniciate-appointment.application.service";
import { CompleteAppointmentApplicationService, CompleteAppointmentApplicationServiceDto } from "../../../appointment/application/services/complete-appointment.application.service";
import { SessionGuard } from "../../../core/infrastructure/security/auth/sessions/session.guard";
import { GetDoctorId } from "../../../core/infrastructure/security/users/decorators/get-doctor-id.decortator";
import { GetPatientId } from "../../../core/infrastructure/security/users/decorators/get-patient-id.decorator";
import { Role } from "../../../core/infrastructure/security/users/roles/role.entity.enum";
import { Roles } from "../../../core/infrastructure/security/users/roles/roles.decorator";
import { RolesGuard } from "../../../core/infrastructure/security/users/roles/roles.guard";
import { AppointmentCompleted } from "src/appointment/domain/events/appointment-completed";
import { CreateMedicalRecordApplicationService } from "src/medical-record/application/services/create-medical-record.aplication.service";
import { OrmMedicalRecordRepository } from "src/medical-record/infrastructure/repositories/orm-medical-record.repository";

@Controller('appointment')
export class AppointmentController {

    private readonly ormPatientRepository: OrmPatientRepository;
    private readonly ormAppointmentRepository: OrmAppointmentRepository;
    private readonly ormDoctorRepository: OrmDoctorRepository;
    private readonly uuidGenerator: UUIDGenerator = new UUIDGenerator();
    private readonly agoraApiTokenGenerator: AgoraApiTokenGenerator;
    private readonly ormMedicalRecordRepository: OrmMedicalRecordRepository;

    constructor(private readonly manager: EntityManager, private readonly httpService: HttpService) {
        if (!manager) { throw new Error("Entity manager can't be null"); }
        this.ormPatientRepository = this.manager.getCustomRepository(OrmPatientRepository);
        this.ormAppointmentRepository = this.manager.getCustomRepository(OrmAppointmentRepository);
        this.ormDoctorRepository = this.manager.getCustomRepository(OrmDoctorRepository);
        this.agoraApiTokenGenerator = new AgoraApiTokenGenerator(this.httpService);
        this.ormMedicalRecordRepository = this.manager.getCustomRepository(OrmMedicalRecordRepository);
    }


    @Post('/request')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async requestAppointment(@GetPatientId() id, @Body() dto: RequestAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.patientId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new RequestAppointmentApplicationService(this.ormAppointmentRepository, this.ormPatientRepository, this.ormDoctorRepository, this.uuidGenerator, eventBus),
                    new NestLogger()
                ),
                new FirebaseNotifier(
                    async (data: RequestAppointmentApplicationServiceDto) => {
                        const patient = await this.ormPatientRepository.findOneById(PatientId.create(data.patientId));
                        return {
                            doctorId: DoctorId.create(dto.doctorId),
                            message: {
                                title: "Cita Solicitada - " + dto.doctorSpecialty.charAt(0).toUpperCase() + dto.doctorSpecialty.slice(1).toLowerCase(),
                                body: "Paciente: " + patient.Names.FirstName + " " + patient.SurNames.FirstSurname + " - " + dto.type.charAt(0).toUpperCase() + dto.type.slice(1).toLowerCase(),
                                payload: ""
                            }
                        };
                    }
                )
            )
        );

        return await service.execute(dto);
    }

    @Post('schedule')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async scheduleAppointment(@GetDoctorId() id, @Body() dto: ScheduleAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.doctorId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new ScheduleAppointmentApplicationService(this.ormAppointmentRepository, this.ormDoctorRepository, eventBus),
                    new NestLogger()
                ),
                new FirebaseNotifier(
                    async (data: ScheduleAppointmentApplicationServiceDto) => {
                        const appointment = await this.ormAppointmentRepository.findOneById(AppointmentId.create(data.id));
                        const doctor = await this.ormDoctorRepository.findOneById(appointment.Doctor.Id);
                        return {
                            patientId: appointment.Patient.Id,
                            message: {
                                title: "Cita Agendada",
                                body: ((doctor.Gender.Value == DoctorGenderEnum.MALE) ? 'Dr.' : 'Dra.') + doctor.Names.FirstName + " " + doctor.Surnames.FirstSurname + " - " + (new Date(data.date).toLocaleString()),
                                payload: JSON.stringify({ appointmentId: appointment.Id.Value })
                            }
                        };
                    }
                )
            )
        );

        return await service.execute(dto);
    }

    @Post('reject/doctor')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async rejectAppointmentDoctor(@GetDoctorId() id, @Body() dto: RejectDoctorAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.doctorId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new RejectDoctorAppointmentApplicationService(this.ormAppointmentRepository, eventBus, this.ormDoctorRepository),
                    new NestLogger()
                ),
                new FirebaseNotifier(
                    async (data: RejectDoctorAppointmentApplicationServiceDto) => {
                        const appointment = await this.ormAppointmentRepository.findOneById(AppointmentId.create(data.id));
                        const doctor = await this.ormDoctorRepository.findOneById(appointment.Doctor.Id);
                        return {
                            patientId: appointment.Patient.Id,
                            message: {
                                title: "Cita Rechazada",
                                body: ((doctor.Gender.Value == DoctorGenderEnum.MALE) ? 'Dr.' : 'Dra.') + doctor.Names.FirstName + " " + doctor.Surnames.FirstSurname + " ha rechazado la cita.",
                                payload: JSON.stringify({ appointmentId: appointment.Id.Value })
                            }
                        };
                    }
                )
            )
        );

        return await service.execute(dto);
    }

    @Post('reject/patient')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async rejectAppointmentPatient(@GetPatientId() id, @Body() dto: RejectPatientAppointmentApplicationServiceDto): Promise<Result<string>> {
        console.log(dto);

        dto.patientId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new RejectPatientAppointmentApplicationService(this.ormAppointmentRepository, eventBus, this.ormPatientRepository),
                    new NestLogger()
                ),
                new FirebaseNotifier(
                    async (data: RejectPatientAppointmentApplicationServiceDto) => {
                        const appointment = await this.ormAppointmentRepository.findOneById(AppointmentId.create(data.id));
                        const patient = await this.ormPatientRepository.findOneById(PatientId.create(id));
                        return {
                            doctorId: appointment.Doctor.Id,
                            message: {
                                title: "Cita Rechazada",
                                body: "Paciente: " + patient.Names.FirstName + " " + patient.SurNames.FirstSurname + " ha rechazado la cita agendada.",
                                payload: JSON.stringify({ appointmentId: appointment.Id.Value })
                            }
                        };
                    }
                )
            )
        );

        return await service.execute(dto);
    }

    @Post('accept/patient')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async acceptAppointmentPatient(@GetPatientId() id, @Body() dto: AcceptPatientAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.patientId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new AcceptPatientAppointmentApplicationService(this.ormAppointmentRepository, eventBus, this.ormPatientRepository),
                    new NestLogger()
                ),
                new FirebaseNotifier(
                    async (data: AcceptPatientAppointmentApplicationServiceDto) => {
                        const appointment = await this.ormAppointmentRepository.findOneById(AppointmentId.create(data.id));
                        const patient = await this.ormPatientRepository.findOneById(PatientId.create(id));
                        return {
                            doctorId: appointment.Doctor.Id,
                            message: {
                                title: "Cita Aceptada",
                                body: "Paciente: " + patient.Names.FirstName + " " + patient.SurNames.FirstSurname + " ha aceptado la cita agendada.",
                                payload: ""
                            }
                        };
                    }
                )
            )
        );
        return await service.execute(dto);
    }

    @Post('cancel/doctor')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async cancelAppointmentDoctor(@GetDoctorId() id, @Body() dto: CancelDoctorAppointmentApplicationServiceDto): Promise<Result<string>> {

        dto.doctorId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new CancelDoctorAppointmentApplicationService(this.ormAppointmentRepository, eventBus, this.ormDoctorRepository),
                    new NestLogger()
                ),
                new FirebaseNotifier(
                    async (data: CancelDoctorAppointmentApplicationServiceDto) => {
                        const appointment = await this.ormAppointmentRepository.findOneById(AppointmentId.create(data.id));
                        const doctor = await this.ormDoctorRepository.findOneById(appointment.Doctor.Id);
                        return {
                            patientId: appointment.Patient.Id,
                            message: {
                                title: "Cita Cancelada",
                                body: ((doctor.Gender.Value == DoctorGenderEnum.MALE) ? 'Dr.' : 'Dra.') + doctor.Names.FirstName + " " + doctor.Surnames.FirstSurname + " canceló su cita.",
                                payload: JSON.stringify({ appointmentId: appointment.Id.Value })
                            }
                        };
                    }
                )
            )
        );
        return await service.execute(dto);
    }

    @Post('cancel/patient')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async cancelAppointmentPatient(@GetPatientId() id, @Body() dto: CancelPatientAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.patientId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new CancelPatientAppointmentApplicationService(this.ormAppointmentRepository, eventBus, this.ormPatientRepository),
                    new NestLogger()
                ),
                new FirebaseNotifier(
                    async (data: CancelPatientAppointmentApplicationServiceDto) => {
                        const appointment = await this.ormAppointmentRepository.findOneById(AppointmentId.create(data.id));
                        const patient = await this.ormPatientRepository.findOneById(PatientId.create(id));
                        return {
                            doctorId: appointment.Doctor.Id,
                            message: {
                                title: "Cita Cancelada",
                                body: "Paciente: " + patient.Names.FirstName + " " + patient.SurNames.FirstSurname + " ha cancelado la cita agendada.",
                                payload: ""
                            }
                        };
                    }
                )
            )
        );
        return await service.execute(dto);
    }

    @Post('call')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async initiateCall(@GetDoctorId() id, @Body() dto: InitiateAppointmentCallApplicationServiceDto): Promise<Result<{ token: string, channelName: string }>> {
        dto.doctorId = id;

        // const channelName = this.uuidGenerator.generate()
        const channelName = dto.id;

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new InitiateAppointmentCallApplicationService(this.ormAppointmentRepository, this.ormDoctorRepository, this.ormPatientRepository),
                    new NestLogger()
                ),
                new FirebaseNotifier(
                    async (data: InitiateAppointmentCallApplicationServiceDto) => {
                        const appointment = await this.ormAppointmentRepository.findOneById(AppointmentId.create(data.id));
                        const doctor = await this.ormDoctorRepository.findOneById(appointment.Doctor.Id);
                        const pattientToken = await this.agoraApiTokenGenerator.generateCallToken(channelName);
                        return {
                            patientId: appointment.Patient.Id,
                            message: {
                                title: "Llamada Entrante",
                                body: "Videollamada del " + ((doctor.Gender.Value == DoctorGenderEnum.MALE) ? 'Dr.' : 'Dra.') + doctor.Names.FirstName + " " + doctor.Surnames.FirstSurname,
                                payload: JSON.stringify({ token: pattientToken, channelName: channelName })
                            }
                        };
                    }
                )
            )
        );

        const result = await service.execute(dto);
        const doctorToken = await this.agoraApiTokenGenerator.generateCallToken(channelName);

        return ResultMapper.map(
            result,
            (value: string) => {
                return { token: doctorToken, channelName: channelName };
            }
        )
    }

    @Post('rate/patient')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async ratePatientAppointment(@GetPatientId() id, @Body() dto: RateAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.patientId = id;

        const eventBus = EventBus.getInstance();

        eventBus.subscribe(
            AppointmentRated.eventName(),
            async (value: AppointmentRated) => {
                const service = new ErrorApplicationServiceDecorator(
                    new LoggingApplicationServiceDecorator(
                        new UpdateDoctorRatingApplicationService(this.ormAppointmentRepository, this.ormDoctorRepository, eventBus),
                        new NestLogger()
                    )
                );
                await service.execute({ doctorId: value.doctorId.Value });
            }
        );

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new RateAppointmentApplicationService(this.ormAppointmentRepository, this.ormPatientRepository, eventBus),
                new NestLogger()
            )
        );

        return await service.execute(dto);
    }

    @Post('initiate/patient')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async iniciateAppointment(@GetPatientId() id, @Body() dto: InitiateAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.patientId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new InitiateAppointmentApplicationService(this.ormAppointmentRepository, eventBus, this.ormPatientRepository),
                new NestLogger()
            )
        );
        return await service.execute(dto);
    }

    @Post('complete')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async completeAppointment(@GetDoctorId() id, @Body() dto: CompleteAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.doctorId = id;

        const eventBus = EventBus.getInstance();

        eventBus.subscribe(AppointmentCompleted.eventName(), async (event: AppointmentCompleted) => {
            const eventBus = EventBus.getInstance();

            const service = new ErrorApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new CreateMedicalRecordApplicationService(
                        this.ormMedicalRecordRepository,
                        this.ormAppointmentRepository,
                        this.uuidGenerator,
                        eventBus
                    ),
                    new NestLogger()
                )
            );

            await service.execute({
                appointmentId: event.id.Value,
                doctorId: id,
            });
        });

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new CompleteAppointmentApplicationService(this.ormAppointmentRepository, eventBus, this.ormDoctorRepository),
                new NestLogger()
            )
        );

        return await service.execute(dto);
    }
}
