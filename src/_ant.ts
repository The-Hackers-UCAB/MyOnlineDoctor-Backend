import { Appointment } from "./appointment/domain/appointment";
import { AppointmentDate } from "./appointment/domain/value-objects/appointment-date";
import { AppointmentDescription } from "./appointment/domain/value-objects/appointment-description";
import { AppointmentDoctor } from "./appointment/domain/value-objects/appointment-doctor";
import { AppointmentDuration } from "./appointment/domain/value-objects/appointment-duration";
import { AppointmentId } from "./appointment/domain/value-objects/appointment-id";
import { AppointmentPatient } from "./appointment/domain/value-objects/appointment-patient";
import { AppointmentStatus } from "./appointment/domain/value-objects/appointment-status";
import { AppointmentStatusEnum } from "./appointment/domain/value-objects/appointment-status.enum";
import { AppointmentType } from "./appointment/domain/value-objects/appointment-type";
import { AppointmentTypeEnum } from "./appointment/domain/value-objects/appointment-type.enum";
import { DoctorId } from "./doctor/domain/value-objects/doctor-id";
import { DoctorSpecialty } from "./doctor/domain/value-objects/doctor-specialty";
import { DoctorSpecialtyEnum } from "./doctor/domain/value-objects/doctor-specialty.enum";
import { PatientId } from "./patient/domain/value-objects/patient-id";

export function _ant_testing() {

    const appointment = Appointment.create(
        AppointmentId.create('ea039a82-060a-11ed-b939-0242ac120002'),
        AppointmentDate.create(new Date("02/02/2023")),
        AppointmentDescription.create("Cita numero 1 con el doctor John"),
        AppointmentDuration.create(1),
        AppointmentStatus.create(AppointmentStatusEnum.REQUESTED),
        AppointmentType.create(AppointmentTypeEnum.INPERSON),
        AppointmentPatient.create(PatientId.create('7c7ef49a-0603-11ed-b939-0242ac120002')),
        AppointmentDoctor.create(DoctorId.create('7c7ef6d4-0603-11ed-b939-0242ac120002'), DoctorSpecialty.create(DoctorSpecialtyEnum.CARDIOLOGY)),
    );

    console.log(appointment.pullEvents());
    console.log(appointment);
}