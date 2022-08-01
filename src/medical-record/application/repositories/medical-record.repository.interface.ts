import { MedicalRecordID } from "../../../medical-record/domain/value-objects/medical-record-id";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { MedicalRecord } from "../../../medical-record/domain/medical-record";
import { IRepository } from "../../../core/application/repositories/repository.interface";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";

export interface IMedicalRecordRepository extends IRepository<MedicalRecordID, MedicalRecord> {
    findMedicalRecordByPatient(id: PatientId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]>;

    findMedicalRecordByAppointment(id: AppointmentId): Promise<MedicalRecord>;
}
