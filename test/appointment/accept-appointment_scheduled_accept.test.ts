import { ErrorApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NotifierApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/notifier-decorator/notifier.application.service.decorator";
import { NestLogger } from "../../src/core/infrastructure/logger/nest-logger";
import { NotifierMock } from "../../test/core/adapters-mocks/notifier.mock";
import { AcceptPatientAppointmentApplicationService, AcceptPatientAppointmentApplicationServiceDto } from "../../src/appointment/application/services/accept-patient-appointment.application.service";
import { EventBus } from "../../src/core/infrastructure/event-handler/event-bus";
import { AppointmentObjectMother } from "../../test/core/objects-mother/appointment.object-mother";
import { DoctorObjectMother } from "../../test/core/objects-mother/doctor.object-mother";
import { PatientObjectMother } from "../../test/core/objects-mother/patient.object-mother";
import { AppointmentRepositoryMock } from "../../test/core/repository-mocks/appointment.repository.mock";
import { DoctorRepositoryMock } from "../../test/core/repository-mocks/doctor.repository.mock";
import { PatientRepositoryMock } from "../../test/core/repository-mocks/patient.repository.mock";


describe('Aceptar una cita que este agendada', () => {

    it('Exitosa', async () => {
            
            //Arrange
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
    
            const dto: AcceptPatientAppointmentApplicationServiceDto = { id: appointment.Id.Value, patientId: patient.Id.Value };
    
            const service = new ErrorApplicationServiceDecorator(
                new NotifierApplicationServiceDecorator(
                    new LoggingApplicationServiceDecorator(
                        new AcceptPatientAppointmentApplicationService(appointmentRepositoryMock, eventBus, patientRepositoryMock),
                        new NestLogger(),
                ),
                new NotifierMock(
                    async (data: AcceptPatientAppointmentApplicationServiceDto) => {
                        return { message: 'Cita Aceptada' };
                    }
                )
                )
            );
    
            //Act
            const result = await service.execute(dto);
    
            //Assert
            expect(result.IsSuccess).toBeTruthy();
    
    })

});