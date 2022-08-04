import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { Appointment } from "../../../appointment/domain/appointment";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { IRepository } from "../../../core/application/repositories/repository.interface";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { Patient } from "../../../../src/patient/domain/patient";

export interface IAppointmentRepository extends IRepository<AppointmentId, Appointment> {
    findPatientAppointments(id: PatientId, paging?: RepositoryPagingDto): Promise<Appointment[]>;
    findDoctorAppointments(id: DoctorId, paging?: RepositoryPagingDto): Promise<Appointment[]>;
    findDoctorAppointmentsAndCount(id: DoctorId): Promise<{ total: number, total_rating: number }>;
    findDoctorPatients(id: DoctorId) : Promise<Patient[]>;
}