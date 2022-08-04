import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { IMedicalRecordRepository } from "../../../medical-record/application/repositories/medical-record.repository.interface";
import { InvalidMedicalRecordException } from "../../../medical-record/domain/exceptions/invalid-medical-record.exception";
import { MedicalRecord } from "../../../medical-record/domain/medical-record";
import { MedicalRecordID } from "../../../medical-record/domain/value-objects/medical-record-id";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { EntityRepository, Repository } from "typeorm";
import { OrmMedicalRecord } from "../entities/orm.medical-record.entity";
import { OrmMedicalRecordMulMapper } from "../mappers/orm-medical-record-mul.mapper";
import { OrmMedicalRecordMapper } from "../mappers/orm-medical-record.mapper";
import { DoctorId } from "../../../../src/doctor/domain/value-objects/doctor-id";

@EntityRepository(OrmMedicalRecord)
export class OrmMedicalRecordRepository extends Repository<OrmMedicalRecord> implements IMedicalRecordRepository {

    private readonly ormMedicalRecordMapper: OrmMedicalRecordMapper = new OrmMedicalRecordMapper();
    private readonly ormMedicalRecordMulMapper: OrmMedicalRecordMulMapper = new OrmMedicalRecordMulMapper();

    async saveAggregate(aggregate: MedicalRecord): Promise<void> {
        const ormMedicalRecord = await this.ormMedicalRecordMapper.fromDomainToOther(aggregate);
        await this.save(ormMedicalRecord);
    }

    async findOneById(id: MedicalRecordID): Promise<MedicalRecord> {
        const ormMedicalRecord = await this.findOne({ where: { id: id.Value } });
        return await this.ormMedicalRecordMapper.fromOtherToDomain(ormMedicalRecord);
    }

    async findOneByIdOrFail(id: MedicalRecordID): Promise<MedicalRecord> {
        const ormMedicalRecord = await this.findOneById(id);
        if (!ormMedicalRecord) { throw new InvalidMedicalRecordException(); }
        return ormMedicalRecord;
    }

    async findMedicalRecordByPatient(id: PatientId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]> {
        const ormMedicalRecords = await this.find({ where: { patientId: id.Value }, order: { updatedAt: 'DESC' }, skip: paging.pageIndex * paging.pageSize, take: paging.pageSize });
        return await this.ormMedicalRecordMulMapper.fromOtherToDomain(ormMedicalRecords);
    }

    async findMedicalRecordByDoctor(id: DoctorId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]> {
        const ormMedicalRecords = await this.find({ where: { doctorId: id.Value }, order: { updatedAt: 'DESC' }, skip: paging.pageIndex * paging.pageSize, take: paging.pageSize });
        return await this.ormMedicalRecordMulMapper.fromOtherToDomain(ormMedicalRecords);
    }

    async findPatientMedicalRecordByDoctor(doctorId: DoctorId, patientId: PatientId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]> {
        const ormMedicalRecords = await this.find({ where: { doctorId: doctorId.Value, patientId: patientId.Value }, order: { updatedAt: 'DESC' }, skip: paging.pageIndex * paging.pageSize, take: paging.pageSize });
        return await this.ormMedicalRecordMulMapper.fromOtherToDomain(ormMedicalRecords);
    }
}
