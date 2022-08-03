import { Appointment } from "../../../src/appointment/domain/appointment";
import { InvalidAppointmentException } from "../../../src/appointment/domain/exceptions/invalid-appointment-exception";
import { AppointmentId } from "../../../src/appointment/domain/value-objects/appointment-id";
import { RepositoryPagingDto } from "../../../src/core/application/repositories/repository-paging.dto";
import { DoctorId } from "../../../src/doctor/domain/value-objects/doctor-id";
import { Patient } from "../../../src/patient/domain/patient";
import { PatientId } from "../../../src/patient/domain/value-objects/patient-id";
import { IAppointmentRepository } from "../../../src/appointment/application/repositories/appointment.repository.interface";

export class AppointmentRepositoryMock implements IAppointmentRepository {
    private readonly appointments: Appointment[] = [];

    async findPatientAppointments(id: PatientId, paging?: RepositoryPagingDto): Promise<Appointment[]> {
        return null;
    }
    async findDoctorAppointments(id: DoctorId, paging?: RepositoryPagingDto): Promise<Appointment[]> {
        return null;
    }
    async findDoctorAppointmentsAndCount(id: DoctorId): Promise<{ total: number; total_rating: number; }> {
        return null;
    }
    async findDoctorPatients(id: DoctorId): Promise<Patient[]> {
        return null;
    }
    async saveAggregate(aggregate: Appointment): Promise<void> {
        this.appointments.push(aggregate);
    }
    async findOneById(id: AppointmentId): Promise<Appointment> {
        for (let i = 0; i < this.appointments.length; i++) {
            const appointment = this.appointments[i];
            if (appointment.Id.equals(id)) { return appointment; }
        }
    }
    async findOneByIdOrFail(id: AppointmentId): Promise<Appointment> {
        const appointment = await this.findOneById(id);
        if (!appointment) { throw new InvalidAppointmentException(); }
        return appointment;
    }
}