import { PatientSurnames } from "src/patient/domain/value-objects/patient-surnames";
import { IMapper } from "../../../core/application/mappers/mapper.interface";
import { Patient } from "../../../patient/domain/patient";
import { OrmPatient } from "../entities/orm-patient.entity";
import { OrmPatientMapper } from "./orm-patient-mapper";

export class OrmPatientMulMapper implements IMapper<Patient[], OrmPatient[]> {
    private readonly ormPatientMapper: OrmPatientMapper;

    constructor() {
        this.ormPatientMapper = new OrmPatientMapper();
    }

    async fromDomainToOther(domain: Patient[]): Promise<OrmPatient[]> {
        if (!domain) { return null; }

        const ormPatients: OrmPatient[] = [];
        for await (const patient of domain) {
            ormPatients.push(await this.ormPatientMapper.fromDomainToOther(patient));
        }

        return ormPatients;
    }

    async fromOtherToDomain(other: OrmPatient[]): Promise<Patient[]> {
        if (!other) { return null; }

        const patients: Patient[] = [];
        for await (const ormPatient of other) {
            patients.push(await this.ormPatientMapper.fromOtherToDomain(ormPatient));
        }

        return patients;
    }
}