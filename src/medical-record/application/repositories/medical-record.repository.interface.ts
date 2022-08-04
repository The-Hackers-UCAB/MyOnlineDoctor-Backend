import { MedicalRecordID } from "../../../medical-record/domain/value-objects/medical-record-id";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { MedicalRecord } from "../../../medical-record/domain/medical-record";
import { IRepository } from "../../../core/application/repositories/repository.interface";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { DoctorId } from "../../../../src/doctor/domain/value-objects/doctor-id";

export interface IMedicalRecordRepository extends IRepository<MedicalRecordID, MedicalRecord> {
    findMedicalRecordByPatient(id: PatientId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]>;
    findMedicalRecordByDoctor(id: DoctorId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]>;
    findPatientMedicalRecordByDoctor(doctorId: DoctorId, patientId: PatientId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]>;
}
