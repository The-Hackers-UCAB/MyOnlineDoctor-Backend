import { DoctorObjectMother } from "../../test/core/objects-mother/doctor.object-mother";
import { ErrorApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator";
import { LoggingApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator";
import { NotifierApplicationServiceDecorator } from "../../src/core/application/application-service/decoratos/notifier-decorator/notifier.application.service.decorator";
import { NestLogger } from "../../src/core/infrastructure/logger/nest-logger";
import { NotifierMock } from "../../test/core/adapters-mocks/notifier.mock";
import { CreateMedicalRecordApplicationService, CreateMedicalRecordApplicationServiceDto } from "../../src/medical-record/application/services/create-medical-record.aplication.service";
import { PatientObjectMother } from "../../test/core/objects-mother/patient.object-mother";
import { AppointmentObjectMother } from "../../test/core/objects-mother/appointment.object-mother";
import { PatientRepositoryMock } from "../../test/core/repository-mocks/patient.repository.mock";
import { DoctorRepositoryMock } from "../../test/core/repository-mocks/doctor.repository.mock";
import { AppointmentRepositoryMock } from "../../test/core/repository-mocks/appointment.repository.mock";
import { EventBus } from "../../src/core/infrastructure/event-handler/event-bus";
import { MedicalRecordRepositoryMock } from "../../test/core/repository-mocks/medical-record.repository.mock";
import { MedicalRecordObjectMother } from "../../test/core/objects-mother/medical-record.object-mother";
import { UUIDGenerator } from "../../src/core/infrastructure/uuid/uuid-generator";

describe("Crear un registro medico con la cita incompleta", () =>{
    it("No debe crearse", async () =>{

        //Arrange
        const patient = PatientObjectMother.createActivePatient();
        const doctor = DoctorObjectMother.createActiveDoctor();
        const appointment = AppointmentObjectMother.createAcceptedAppointment(patient.Id, doctor.Id, doctor.Specialties[0]);
        const medicalRecord = MedicalRecordObjectMother.createMedicalRecord(appointment);

        const patientRepositoryMock = new PatientRepositoryMock();
        await patientRepositoryMock.saveAggregate(patient);

        const doctorRepositoryMock = new DoctorRepositoryMock();
        await doctorRepositoryMock.saveAggregate(doctor);

        const appointmentRepositoryMock = new AppointmentRepositoryMock();
        await appointmentRepositoryMock.saveAggregate(appointment);

        const medicalRecordRepositoryMock = new MedicalRecordRepositoryMock();
        await medicalRecordRepositoryMock.saveAggregate(medicalRecord);

        const eventBus = EventBus.getInstance()

        const dto: CreateMedicalRecordApplicationServiceDto = { appointmentId: appointment.Id.Value, doctorId: doctor.Id.Value}

        const uuid = new UUIDGenerator();

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new CreateMedicalRecordApplicationService(medicalRecordRepositoryMock, appointmentRepositoryMock, uuid, eventBus),
                    new NestLogger(),
            ),
            new NotifierMock(
                async (data: CreateMedicalRecordApplicationServiceDto) => {
                    return { message: 'Medical Record no creado' };
                }
            )
            )
        );

        //Act
        const result = await service.execute(dto);

        //Assert
        expect(result.IsSuccess).toBeFalsy();


    })

})