import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { RequestAppointmentApplicationService, RequestAppointmentApplicationServiceDto } from "src/appointment/application/services/request-appointment.application.service";
import { ScheduleAppointmentApplicationService, ScheduleAppointmentApplicationServiceDto } from "src/appointment/application/services/schedule-appointment.application.service";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";
import { ErrorApplicationServiceDecorator } from "src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NotifierApplicationServiceDecorator } from "src/core/application/application-service/decoratos/notifier-decorator/notifier.application.service.decorator";
import { Result } from "src/core/application/result-handler/result";
import { EventBus } from "src/core/infrastructure/event-handler/event-bus";
import { NestLogger } from "src/core/infrastructure/logger/nest-logger";
import { UUIDGenerator } from "src/core/infrastructure/uuid/uuid-generator";
import { DoctorGenderEnum } from "src/doctor/domain/value-objects/doctor-gender.enum";
import { OrmDoctorRepository } from "src/doctor/infrastructure/repositories/orm-doctor.repository";
import { OrmPatientRepository } from "src/patient/infrastructure/repositories/orm-patient.repository";
import { SessionGuard } from "src/security/auth/sessions/session.guard";
import { GetDoctorId } from "src/security/users/decorators/get-doctor-id.decortator";
import { GetPatientId } from "src/security/users/decorators/get-patient-id.decorator";
import { Role } from "src/security/users/roles/role.entity.enum";
import { Roles } from "src/security/users/roles/roles.decorator";
import { RolesGuard } from "src/security/users/roles/roles.guard";
import { OrmAppointmentRepository } from "../repositories/orm-appointment.repository";
import { EntityManager } from "typeorm";
import { FirebaseMovilNotifier } from "src/core/infrastructure/firebase-notifications/notifier/firebase-movil-notifier";
import { RejectPatientAppointmentApplicationService, RejectPatientAppointmentApplicationServiceDto } from "src/appointment/application/services/reject-patient-appointment.application.service";
import { RejectDoctorAppointmentApplicationService, RejectDoctorAppointmentApplicationServiceDto } from "src/appointment/application/services/reject-doctor-appointment.application.service";
import { AcceptPatientAppointmentApplicationService, AcceptPatientAppointmentApplicationServiceDto } from "src/appointment/application/services/accept-patient-appointment.application.service";

@Controller('appointment')
export class AppointmentController {

    private readonly ormPatientRepository: OrmPatientRepository;
    private readonly ormAppointmentRepository: OrmAppointmentRepository;
    private readonly ormDoctorRepository: OrmDoctorRepository;
    private readonly uuidGenerator: UUIDGenerator = new UUIDGenerator();

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
    async requestAppointment(@GetPatientId() id, @Body() dto: RequestAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.patientId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new RequestAppointmentApplicationService(this.ormAppointmentRepository, this.ormPatientRepository, this.ormDoctorRepository, this.uuidGenerator, eventBus),
                new NestLogger()
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
                new FirebaseMovilNotifier(
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

    @Post('reject/patient')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async rejectPatientAppointment(@GetPatientId() id, @Body() dto: RejectPatientAppointmentApplicationServiceDto): Promise<Result<string>> {
        console.log(dto);

        dto.patientId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new RejectPatientAppointmentApplicationService(this.ormAppointmentRepository, eventBus, this.ormPatientRepository),
                new NestLogger()
            )
        );

        return await service.execute(dto);
    }

    @Post('reject/doctor')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async rejectDoctorAppointment(@GetDoctorId() id, @Body() dto: RejectDoctorAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.doctorId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new RejectDoctorAppointmentApplicationService(this.ormAppointmentRepository, eventBus, this.ormDoctorRepository),
                    new NestLogger()
                ),
                new FirebaseMovilNotifier(
                    async (data: RejectDoctorAppointmentApplicationServiceDto) => {
                        const appointment = await this.ormAppointmentRepository.findOneById(AppointmentId.create(data.id));
                        const doctor = await this.ormDoctorRepository.findOneById(appointment.Doctor.Id);
                        return {
                            patientId: appointment.Patient.Id,
                            message: {
                                title: "Cita Rechazada",
                                body: ((doctor.Gender.Value == DoctorGenderEnum.MALE) ? 'Dr.' : 'Dra.') + doctor.Names.FirstName + " " + doctor.Surnames.FirstSurname + " rechazó su cita.",
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
    async acceptAppointment(@GetPatientId() id, @Body() dto: AcceptPatientAppointmentApplicationServiceDto): Promise<Result<string>> {
        dto.patientId = id;

        const eventBus = EventBus.getInstance();

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new AcceptPatientAppointmentApplicationService(this.ormAppointmentRepository, eventBus, this.ormPatientRepository),
                new NestLogger()
            )
        );
        return await service.execute(dto);
    }
}