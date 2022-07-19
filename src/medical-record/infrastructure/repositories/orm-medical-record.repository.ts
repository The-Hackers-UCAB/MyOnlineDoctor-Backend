import { RepositoryPagingDto } from "src/core/application/repositories/repository-paging.dto";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { IMedicalRecordRepository } from "src/medical-record/application/repositories/medical-record.repository.interface";
import { InvalidMedicalRecordException } from "src/medical-record/domain/exceptions/invalid-medical-record.exception";
import { MedicalRecord } from "src/medical-record/domain/medical-record";
import { MedicalRecordID } from "src/medical-record/domain/value-objects/medical-record-id";
import { PatientId } from "src/patient/domain/value-objects/patient-id";
import { EntityRepository, Repository } from "typeorm";
import { OrmMedicalRecord } from "../entities/orm.medical-record.entity";
import { OrmMedicalRecordMulMapper } from "../mappers/orm-medical-record-mul.mapper";
import { OrmMedicalRecordMapper } from "../mappers/orm-medical-record.mapper";

@EntityRepository(OrmMedicalRecord)
export class OrmMedicalRecordRepository extends Repository<OrmMedicalRecord> implements IMedicalRecordRepository{

    private readonly ormMedicalRecordMapper: OrmMedicalRecordMapper = new OrmMedicalRecordMapper();
    private readonly ormMedicalRecordMulMapper: OrmMedicalRecordMulMapper = new OrmMedicalRecordMulMapper();

    async saveAggregate(aggregate: MedicalRecord): Promise<void> {
        const ormMedicalRecord = await this.ormMedicalRecordMapper.fromDomainToOther(aggregate);
        await this.save(ormMedicalRecord);
    }

    async findOneById(id: MedicalRecordID): Promise<MedicalRecord> {
        const ormMedicalRecord = await this.findOne({ where: { id: id.Value }});
        return await this.ormMedicalRecordMapper.fromOtherToDomain(ormMedicalRecord);
    }

    async findOneByIdOrFail(id: MedicalRecordID): Promise<MedicalRecord> {
        const ormMedicalRecord = await this.findOneById(id);
        if(!ormMedicalRecord){ throw new InvalidMedicalRecordException(); }
        return ormMedicalRecord;
    }

    async findMedicalRecordByPatient(id: PatientId, paging?: RepositoryPagingDto): Promise<MedicalRecord[]> {
        const ormMedicalRecords = await this.find({ where: { patientId: id.Value } });
        return await this.ormMedicalRecordMulMapper.fromOtherToDomain(ormMedicalRecords);
    }
}