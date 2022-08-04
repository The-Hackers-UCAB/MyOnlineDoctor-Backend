import { RateAppointmentApplicationService, RateAppointmentApplicationServiceDto } from "../../src/appointment/application/services/rate-appointment.application.service";
import { ErrorApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { EventBus } from "../../src/core/infrastructure/event-handler/event-bus";
import { NestLogger } from "../../src/core/infrastructure/logger/nest-logger";
import { AppointmentObjectMother } from "../core/objects-mother/appointment.object-mother";
import { DoctorObjectMother } from "../core/objects-mother/doctor.object-mother";
import { PatientObjectMother } from "../core/objects-mother/patient.object-mother";
import { AppointmentRepositoryMock } from "../core/repository-mocks/appointment.repository.mock";
import { DoctorRepositoryMock } from "../core/repository-mocks/doctor.repository.mock";
import { PatientRepositoryMock } from "../core/repository-mocks/patient.repository.mock";

describe('Calificación infravalorada de una cita.', () => {

    it('Debe ser rechazada', async () => {
        //Arrange
        const patient = PatientObjectMother.createActivePatient();
        const doctor = DoctorObjectMother.createActiveDoctor();
        const appointment = AppointmentObjectMother.createInitiatedAppointment(patient.Id, doctor.Id, doctor.Specialties[0]);

        const patientRepositoryMock = new PatientRepositoryMock();
        await patientRepositoryMock.saveAggregate(patient);

        const doctorRepositoryMock = new DoctorRepositoryMock();
        await doctorRepositoryMock.saveAggregate(doctor);

        const appointmentRepositoryMock = new AppointmentRepositoryMock();
        await appointmentRepositoryMock.saveAggregate(appointment);

        const eventBus = EventBus.getInstance()

        const dto: RateAppointmentApplicationServiceDto = { id: appointment.Id.Value, patientId: patient.Id.Value, rating: -1 };

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new RateAppointmentApplicationService(appointmentRepositoryMock, patientRepositoryMock, eventBus),
                new NestLogger(),
            ),
        );

        //Act
        const result = await service.execute(dto);

        //Assert
        expect(result.IsSuccess).toBeFalsy();
    })
});
