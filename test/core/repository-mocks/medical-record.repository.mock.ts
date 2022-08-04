import { RepositoryPagingDto } from "../../../src/core/application/repositories/repository-paging.dto";
import { DoctorId } from "../../../src/doctor/domain/value-objects/doctor-id";
import { IMedicalRecordRepository } from "../../../src/medical-record/application/repositories/medical-record.repository.interface";
import { InvalidMedicalRecordException } from "../../../src/medical-record/domain/exceptions/invalid-medical-record.exception";
import { MedicalRecord } from "../../../src/medical-record/domain/medical-record";
import { MedicalRecordID } from "../../../src/medical-record/domain/value-objects/medical-record-id";
import { PatientId } from "../../../src/patient/domain/value-objects/patient-id";

export class MedicalRecordRepositoryMock implements IMedicalRecordRepository {
    
    private readonly medicalRecords: MedicalRecord[] = [];

    async findMedicalRecordByPatient(id: PatientId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]> {
        return null;
    }
    async findMedicalRecordByDoctor(id: DoctorId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]> {
        return null;
    }
    async saveAggregate(aggregate: MedicalRecord): Promise<void> {
        this.medicalRecords.push(aggregate);
    }
    async findOneById(id: MedicalRecordID): Promise<MedicalRecord> {
        for (let i = 0; i < this.medicalRecords.length; i++) {
            const medicalRecord = this.medicalRecords[i];
            if (medicalRecord.Id.equals(id)) { return medicalRecord; }
        }
    }
    async findOneByIdOrFail(id: MedicalRecordID): Promise<MedicalRecord> {
        const medicalRecord = await this.findOneById(id);
        if (!medicalRecord) { throw new InvalidMedicalRecordException(); }
        return medicalRecord;
    }

    findPatientMedicalRecordByDoctor(doctorId: DoctorId, patientId: PatientId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]> {
        return null;
    }
}