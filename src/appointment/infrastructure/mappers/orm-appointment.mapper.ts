import { AppointmentDate } from "src/appointment/domain/value-objects/appointment-date";
import { AppointmentDescription } from "src/appointment/domain/value-objects/appointment-description";
import { AppointmentDoctor } from "src/appointment/domain/value-objects/appointment-doctor";
import { AppointmentDuration } from "src/appointment/domain/value-objects/appointment-duration";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";
import { AppointmentPatient } from "src/appointment/domain/value-objects/appointment-patient";
import { AppointmentStatus } from "src/appointment/domain/value-objects/appointment-status";
import { AppointmentType } from "src/appointment/domain/value-objects/appointment-type";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";
import { PatientId } from "src/patient/domain/value-objects/patient-id";
import { Appointment } from "../../../appointment/domain/appointment";
import { IMapper } from "../../../core/application/mappers/mapper.interface";
import { OrmAppointment } from "../entities/orm.appointment.entity";

export class OrmAppointmentMapper implements IMapper<Appointment, OrmAppointment>{
    async fromDomainToOther(domain: Appointment): Promise<OrmAppointment> {
        //Verificamos que no sea null
        if (!domain) { return null; }

        //Creamos un objeto de cita de tipo ORM.
        const ormAppointment: OrmAppointment = await OrmAppointment.create(
            domain.Id.Value,
            domain.Date.Value,
            domain.Description.Value,
            domain.Duration.Value,
            domain.Status.Value,
            domain.Type.Value,
            domain.Patient.Id.Value,
            domain.Doctor.Id.Value,
            domain.Doctor.Rating,
            domain.Doctor.Specialty.Value,
        );

        return ormAppointment;
    }

    async fromOtherToDomain(other: OrmAppointment): Promise<Appointment> {
        //Verificamos que no sea null
        if (!other) { return null; }

        //Creamos el objeto de cita de dominio.
        const appointment: Appointment = Appointment.create(
            AppointmentId.create(other.id),
            AppointmentDate.create(other.date),
            AppointmentDescription.create(other.description),
            AppointmentDuration.create(other.duration),
            AppointmentStatus.create(other.status),
            AppointmentType.create(other.type),
            AppointmentPatient.create(PatientId.create(other.patientId)),
            AppointmentDoctor.create(
                DoctorId.create(other.doctorId),
                DoctorSpecialty.create(other.specialty.specialty)
            )
        );

        //Removemos los eventos ya que se está restaurando mas no creado
        appointment.pullEvents();

        return appointment;
    }
}