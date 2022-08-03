import { ErrorApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NotifierApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/notifier-decorator/notifier.application.service.decorator";
import { NestLogger } from "../../src/core/infrastructure/logger/nest-logger";
import { NotifierMock } from "../../test/core/adapters-mocks/notifier.mock";
import { AppointmentObjectMother } from "../../test/core/objects-mother/appointment.object-mother";
import { DoctorObjectMother } from "../../test/core/objects-mother/doctor.object-mother";
import { PatientObjectMother } from "../../test/core/objects-mother/patient.object-mother";
import { AppointmentRepositoryMock } from "../../test/core/repository-mocks/appointment.repository.mock";
import { DoctorRepositoryMock } from "../../test/core/repository-mocks/doctor.repository.mock";
import { PatientRepositoryMock } from "../../test/core/repository-mocks/patient.repository.mock";
import { InitiateAppointmentCallApplicationService, InitiateAppointmentCallApplicationServiceDto } from "../../src/appointment/application/services/initiate-appointment-call.application.service";

describe("Iniciar una llamada a paciente suspendido", () => {
    it("debe ser rechazada", async () => {
        //Arrange
        const patient = PatientObjectMother.createSuspendedPatient();
        const doctor = DoctorObjectMother.createActiveDoctor();
        const appointment = AppointmentObjectMother.createAcceptedAppointment(patient.Id, doctor.Id, doctor.Specialties[0]);

        const patientRepositoryMock = new PatientRepositoryMock();
        await patientRepositoryMock.saveAggregate(patient);

        const doctorRepositoryMock = new DoctorRepositoryMock();
        await doctorRepositoryMock.saveAggregate(doctor);

        const appointmentRepositoryMock = new AppointmentRepositoryMock();
        await appointmentRepositoryMock.saveAggregate(appointment);

        const dto = { id: appointment.Id.Value, doctorId: doctor.Id.Value };

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new InitiateAppointmentCallApplicationService(appointmentRepositoryMock, doctorRepositoryMock, patientRepositoryMock),
                    new NestLogger()
                ),
                new NotifierMock(
                    async (data: InitiateAppointmentCallApplicationServiceDto) => {
                        return { message: "Lamando al paciente." }
                    }
                )
            )
        );

        //Act
        const result = await service.execute(dto);

        //Assert 
        expect(() => !result.IsSuccess)
    })
});