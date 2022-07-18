import { MedicalRecordID } from "src/medical-record/domain/value-objects/medical-record-id";
import { PatientId } from "src/patient/domain/value-objects/patient-id";
import { MedicalRecord } from "src/medical-record/domain/medical-record";
import { IRepository } from "src/core/application/repositories/repository.interface";
import { RepositoryPagingDto } from "src/core/application/repositories/repository-paging.dto";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";

export interface IMedicalRecordRepository extends IRepository<MedicalRecordID, MedicalRecord>{
    findMedicalRecordByPatient(id: PatientId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]>;
}
