import { ErrorApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NotifierApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/notifier-decorator/notifier.application.service.decorator";
import { NestLogger } from "../../src/core/infrastructure/logger/nest-logger";
import { NotifierMock } from "../core/adapters-mocks/notifier.mock";
import { EventBus } from "../../src/core/infrastructure/event-handler/event-bus";
import { AppointmentObjectMother } from "../core/objects-mother/appointment.object-mother";
import { DoctorObjectMother } from "../core/objects-mother/doctor.object-mother";
import { PatientObjectMother } from "../core/objects-mother/patient.object-mother";
import { AppointmentRepositoryMock } from "../core/repository-mocks/appointment.repository.mock";
import { DoctorRepositoryMock } from "../core/repository-mocks/doctor.repository.mock";
import { PatientRepositoryMock } from "../core/repository-mocks/patient.repository.mock";
import { RejectPatientAppointmentApplicationService, RejectPatientAppointmentApplicationServiceDto } from "../../src/appointment/application/services/reject-patient-appointment.application.service";


describe('Rechazar una cita que esta agendada', () => {

    it('Existosa', async () => {


        //arrange
        const patient = PatientObjectMother.createActivePatient();
        const doctor = DoctorObjectMother.createActiveDoctor();
        const appointment = AppointmentObjectMother.createScheduledAppointment(patient.Id, doctor.Id, doctor.Specialties[0]);

        const patientRepositoryMock = new PatientRepositoryMock();
        await patientRepositoryMock.saveAggregate(patient);

        const doctorRepositoryMock = new DoctorRepositoryMock();
        await doctorRepositoryMock.saveAggregate(doctor);

        const appointmentRepositoryMock = new AppointmentRepositoryMock();
        await appointmentRepositoryMock.saveAggregate(appointment);

        const eventBus = EventBus.getInstance()

        const dto: RejectPatientAppointmentApplicationServiceDto = { id: appointment.Id.Value, patientId: patient.Id.Value };

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new RejectPatientAppointmentApplicationService(appointmentRepositoryMock, eventBus, patientRepositoryMock),
                    new NestLogger(),
                ),
                new NotifierMock(
                    async (data: RejectPatientAppointmentApplicationServiceDto) => {
                        return { message: 'Cita Cancelada' };
                    }
                ),
            ),
        );

        //act
        const result = await service.execute(dto);

        //assert
        expect(result.IsSuccess).toBeTruthy();


    })

});