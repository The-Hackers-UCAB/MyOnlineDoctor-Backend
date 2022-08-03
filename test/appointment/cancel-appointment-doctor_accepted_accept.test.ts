import { CancelDoctorAppointmentApplicationService, CancelDoctorAppointmentApplicationServiceDto } from "../../src/appointment/application/services/cancel-doctor-appointment.application.service";
import { ErrorApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NotifierApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/notifier-decorator/notifier.application.service.decorator";
import { EventBus } from "../../src/core/infrastructure/event-handler/event-bus";
import { NestLogger } from "../../src/core/infrastructure/logger/nest-logger";
import { NotifierMock } from "../core/adapters-mocks/notifier.mock";
import { AppointmentObjectMother } from "../core/objects-mother/appointment.object-mother";
import { DoctorObjectMother } from "../core/objects-mother/doctor.object-mother";
import { PatientObjectMother } from "../core/objects-mother/patient.object-mother";
import { AppointmentRepositoryMock } from "../core/repository-mocks/appointment.repository.mock";
import { DoctorRepositoryMock } from "../core/repository-mocks/doctor.repository.mock";
import { PatientRepositoryMock } from "../core/repository-mocks/patient.repository.mock";

describe('Un doctor cancela una cita aceptada', () => {

    it('Exitosa', async () =>  {

        //Arrange

        const patient = PatientObjectMother.createActivePatient();
        const doctor = DoctorObjectMother.createActiveDoctor();
        const appointment = AppointmentObjectMother.createAcceptedAppointment(patient.Id, doctor.Id, doctor.Specialties[0]);

        const patientRepositoryMock = new PatientRepositoryMock();
        await patientRepositoryMock.saveAggregate(patient);

        const doctorRepositoryMock = new DoctorRepositoryMock();
        await doctorRepositoryMock.saveAggregate(doctor);

        const appointmentRepositoryMock = new AppointmentRepositoryMock();
        await appointmentRepositoryMock.saveAggregate(appointment);

        const eventBus = EventBus.getInstance()

        const dto: CancelDoctorAppointmentApplicationServiceDto = { id: appointment.Id.Value, doctorId: doctor.Id.Value };

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new CancelDoctorAppointmentApplicationService(appointmentRepositoryMock, eventBus, doctorRepositoryMock),
                    new NestLogger(),
                ),
                new NotifierMock(
                    async (data: CancelDoctorAppointmentApplicationServiceDto) => {
                        return { message: 'Cita Cancelada' };
                    }
                ),
            ),
        );

        //Act
        const result = await service.execute(dto);

        //Assert
        expect(result.IsSuccess).toBeTruthy();
    })

});