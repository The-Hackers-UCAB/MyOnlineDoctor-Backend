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
import { MedicalRecordObjectMother } from "../core/objects-mother/medical-record.object-mother";
import { UpdateDescriptionMedicalRecordApplicationService, UpdateDescriptionMedicalRecordApplicationServiceDto } from "../../src/medical-record/application/services/update-description-medical-record.application.service";


describe('Actualizar la descripción de un registro medico', () => {

    it('Exitosa', async () => {

        //arrange
        const patient = PatientObjectMother.createActivePatient();
        const doctor = DoctorObjectMother.createActiveDoctor();

        const appointment = AppointmentObjectMother.createCompletedAppointment(patient.Id, doctor.Id, doctor.Specialties[0]);
        const medicalRecord = MedicalRecordObjectMother.createMedicalRecord(appointment);

        const patientRepositoryMock = new PatientRepositoryMock();
        await patientRepositoryMock.saveAggregate(patient);

        const doctorRepositoryMock = new DoctorRepositoryMock();
        await doctorRepositoryMock.saveAggregate(doctor);

        const appointmentRepositoryMock = new AppointmentRepositoryMock();
        await appointmentRepositoryMock.saveAggregate(appointment);

        const medicalRecordRepositoryMock = new MedicalRecordRepositoryMock();
        await medicalRecordRepositoryMock.saveAggregate(medicalRecord);

        const eventBus = EventBus.getInstance();

        const dto: UpdateDescriptionMedicalRecordApplicationServiceDto = { id: medicalRecord.Id.Value, description: "Nueva descripción prueba", doctorId: doctor.Id.Value };

        const service = new ErrorApplicationServiceDecorator(
            new NotifierApplicationServiceDecorator(
                new LoggingApplicationServiceDecorator(
                    new UpdateDescriptionMedicalRecordApplicationService(medicalRecordRepositoryMock, doctorRepositoryMock, eventBus),
                    new NestLogger(),
                ),
                new NotifierMock(
                    async (data: UpdateDescriptionMedicalRecordApplicationServiceDto) => {
                        return { message: 'Descripción de registro médico actualizado' };
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