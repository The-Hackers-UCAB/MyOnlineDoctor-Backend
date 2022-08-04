import { UUIDGenerator } from "../../src/core/infrastructure/uuid/uuid-generator";
import { CreateMedicalRecordApplicationService, CreateMedicalRecordApplicationServiceDto } from "../../src/medical-record/application/services/create-medical-record.aplication.service";
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
import { MedicalRecordRepositoryMock } from "../core/repository-mocks/medical-record.repository.mock";


describe('Crear un registro medico de una cita con un doctor diferente al doctor de la cita', () => {

    it('No exitosa', async () => {

        //arrange
        const patient = PatientObjectMother.createActivePatient();
        const doctorA = DoctorObjectMother.createActiveDoctor();
        const doctorB = DoctorObjectMother.createActiveDoctor();

        const appointment = AppointmentObjectMother.createCompletedAppointment(patient.Id, doctorA.Id, doctorA.Specialties[0]);


        const medicalRecordRepositoryMock = new MedicalRecordRepositoryMock();

        const patientRepositoryMock = new PatientRepositoryMock();
        await patientRepositoryMock.saveAggregate(patient);

        const doctorRepositoryMockA = new DoctorRepositoryMock();
        await doctorRepositoryMockA.saveAggregate(doctorA);

        const doctorRepositoryMockB = new DoctorRepositoryMock();
        await doctorRepositoryMockB.saveAggregate(doctorB);

        const appointmentRepositoryMock = new AppointmentRepositoryMock();
        await appointmentRepositoryMock.saveAggregate(appointment);

        const uuid = new UUIDGenerator();

        const eventBus = EventBus.getInstance();

        const dto: CreateMedicalRecordApplicationServiceDto = { appointmentId: appointment.Id.Value, doctorId: doctorB.Id.Value };

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new CreateMedicalRecordApplicationService(medicalRecordRepositoryMock, appointmentRepositoryMock, uuid, eventBus),
                    new NestLogger(),
                ),
                new NotifierMock(
                    async (data: CreateMedicalRecordApplicationServiceDto) => {
                        return { message: 'Registro médico no creado' };
                    }
                ),
            ),
        );

        //act
        const result = await service.execute(dto);

        //assert
        expect(result.IsSuccess).toBeFalsy();

    })
});