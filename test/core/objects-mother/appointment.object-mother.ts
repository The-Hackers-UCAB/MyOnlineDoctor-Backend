import { Appointment } from "src/appointment/domain/appointment";
import { AppointmentDate } from "src/appointment/domain/value-objects/appointment-date";
import { AppointmentDescription } from "src/appointment/domain/value-objects/appointment-description";
import { AppointmentDoctor } from "src/appointment/domain/value-objects/appointment-doctor";
import { AppointmentDuration } from "src/appointment/domain/value-objects/appointment-duration";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";
import { AppointmentPatient } from "src/appointment/domain/value-objects/appointment-patient";
import { AppointmentStatus } from "src/appointment/domain/value-objects/appointment-status";
import { AppointmentStatusEnum } from "src/appointment/domain/value-objects/appointment-status.enum";
import { AppointmentType } from "src/appointment/domain/value-objects/appointment-type";
import { AppointmentTypeEnum } from "src/appointment/domain/value-objects/appointment-type.enum";
import { UUIDGenerator } from "src/core/infrastructure/uuid/uuid-generator";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";
import { PatientId } from "src/patient/domain/value-objects/patient-id";

export class AppointmentObjectMother {
    static createRequestedAppointment(patientId: PatientId, doctorId: DoctorId, doctorSpecialty: DoctorSpecialty) {
        const uuid = new UUIDGenerator();

        const appointment = Appointment.create(
            AppointmentId.create(uuid.generate()),
            null,
            AppointmentDescription.create("Cita agendada."),
            null,
            AppointmentStatus.create(AppointmentStatusEnum.REQUESTED),
            AppointmentType.create(AppointmentTypeEnum.VIRTUAL),
            AppointmentPatient.create(patientId),
            AppointmentDoctor.create(doctorId, doctorSpecialty)
        );

        return appointment;
    }

    static createScheduledAppointment(patientId: PatientId, doctorId: DoctorId, doctorSpecialty: DoctorSpecialty) {
        const uuid = new UUIDGenerator();

        const appointment = Appointment.create(
            AppointmentId.create(uuid.generate()),
            AppointmentDate.create(new Date(Date.now())),
            AppointmentDescription.create("Cita agendada."),
            AppointmentDuration.create(5),
            AppointmentStatus.create(AppointmentStatusEnum.SCHEDULED),
            AppointmentType.create(AppointmentTypeEnum.VIRTUAL),
            AppointmentPatient.create(patientId),
            AppointmentDoctor.create(doctorId, doctorSpecialty)
        );

        return appointment;
    }

    static createRejectedAppointment(patientId: PatientId, doctorId: DoctorId, doctorSpecialty: DoctorSpecialty) {
        const uuid = new UUIDGenerator();

        const appointment = Appointment.create(
            AppointmentId.create(uuid.generate()),
            AppointmentDate.create(new Date(Date.now())),
            AppointmentDescription.create("Cita agendada."),
            AppointmentDuration.create(5),
            AppointmentStatus.create(AppointmentStatusEnum.REJECTED),
            AppointmentType.create(AppointmentTypeEnum.VIRTUAL),
            AppointmentPatient.create(patientId),
            AppointmentDoctor.create(doctorId, doctorSpecialty)
        );

        return appointment;
    }

    static createAcceptedAppointment(patientId: PatientId, doctorId: DoctorId, doctorSpecialty: DoctorSpecialty) {
        const uuid = new UUIDGenerator();

        const appointment = Appointment.create(
            AppointmentId.create(uuid.generate()),
            AppointmentDate.create(new Date(Date.now())),
            AppointmentDescription.create("Cita agendada."),
            AppointmentDuration.create(5),
            AppointmentStatus.create(AppointmentStatusEnum.ACCEPTED),
            AppointmentType.create(AppointmentTypeEnum.VIRTUAL),
            AppointmentPatient.create(patientId),
            AppointmentDoctor.create(doctorId, doctorSpecialty)
        );

        return appointment;
    }

    static createCanceledAppointment(patientId: PatientId, doctorId: DoctorId, doctorSpecialty: DoctorSpecialty) {
        const uuid = new UUIDGenerator();

        const appointment = Appointment.create(
            AppointmentId.create(uuid.generate()),
            AppointmentDate.create(new Date(Date.now())),
            AppointmentDescription.create("Cita agendada."),
            AppointmentDuration.create(5),
            AppointmentStatus.create(AppointmentStatusEnum.CANCELED),
            AppointmentType.create(AppointmentTypeEnum.VIRTUAL),
            AppointmentPatient.create(patientId),
            AppointmentDoctor.create(doctorId, doctorSpecialty)
        );

        return appointment;
    }

    static createInitiatedAppointment(patientId: PatientId, doctorId: DoctorId, doctorSpecialty: DoctorSpecialty) {
        const uuid = new UUIDGenerator();

        const appointment = Appointment.create(
            AppointmentId.create(uuid.generate()),
            AppointmentDate.create(new Date(Date.now())),
            AppointmentDescription.create("Cita agendada."),
            AppointmentDuration.create(5),
            AppointmentStatus.create(AppointmentStatusEnum.INICIATED),
            AppointmentType.create(AppointmentTypeEnum.VIRTUAL),
            AppointmentPatient.create(patientId),
            AppointmentDoctor.create(doctorId, doctorSpecialty)
        );

        return appointment;
    }

    static createCompletedAppointment(patientId: PatientId, doctorId: DoctorId, doctorSpecialty: DoctorSpecialty) {
        const uuid = new UUIDGenerator();

        const appointment = Appointment.create(
            AppointmentId.create(uuid.generate()),
            AppointmentDate.create(new Date(Date.now())),
            AppointmentDescription.create("Cita agendada."),
            AppointmentDuration.create(5),
            AppointmentStatus.create(AppointmentStatusEnum.COMPLETED),
            AppointmentType.create(AppointmentTypeEnum.VIRTUAL),
            AppointmentPatient.create(patientId),
            AppointmentDoctor.create(doctorId, doctorSpecialty)
        );

        return appointment;
    }
}