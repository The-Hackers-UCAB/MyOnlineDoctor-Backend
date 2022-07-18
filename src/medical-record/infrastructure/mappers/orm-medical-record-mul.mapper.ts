import { IMapper } from "src/core/application/mappers/mapper.interface";
import { MedicalRecord } from "src/medical-record/domain/medical-record";
import { OrmMedicalRecord } from "../entities/orm.medical-record.entity";
import { OrmMedicalRecordMapper } from "./orm-medical-record.mapper";

export class OrmMedicalRecordMulMapper implements IMapper<MedicalRecord[], OrmMedicalRecord[]>{

    private readonly ormMedicalRecordMapper: OrmMedicalRecordMapper;

    constructor(){
        this.ormMedicalRecordMapper = new OrmMedicalRecordMapper();
    }

    async fromDomainToOther(domain: MedicalRecord[]): Promise<OrmMedicalRecord[]> {
        
        if (!domain) { return null; }

        const ormMedicalRecords: OrmMedicalRecord[] = [];
        for await (const medicalRecord of domain){
            ormMedicalRecords.push(await this.ormMedicalRecordMapper.fromDomainToOther(medicalRecord));
        }

        return ormMedicalRecords;
    }

    async fromOtherToDomain(other: OrmMedicalRecord[]): Promise<MedicalRecord[]> {
        
        if (!other) { return null; }

        const medicalRecords: MedicalRecord[] = [];
        for await (const ormMedicalRecord of other){
            medicalRecords.push(await this.ormMedicalRecordMapper.fromOtherToDomain(ormMedicalRecord))
        }

        return medicalRecords;
    }
}