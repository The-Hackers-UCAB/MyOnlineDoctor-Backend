import { EntityRepository, Repository } from "typeorm";
import { OrmPatient } from "../entities/orm-patient.entity";

import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { IPatientRepository, SearchAssociatedPatientsDomainDto } from "src/patient/application/repositories/patient.repository.interface";
import { Patient } from "../../../patient/domain/patient";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { PatientNames } from "../../../patient/domain/value-objects/patient-names";
import { PatientSurnames } from "../../../patient/domain/value-objects/patient-surnames";
import { PatientBirthdate } from "../../../patient/domain/value-objects/patient-birthdate";
import { PatientAllergies } from "../../../patient/domain/value-objects/patient-allergies";
import { PatientBackground } from "../../../patient/domain/value-objects/patient-background";
import { PatientHeight } from "../../../patient/domain/value-objects/patient-height";
import { PatientWeight } from "../../../patient/domain/value-objects/patient-weight";
import { PatientPhoneNumber } from "../../../patient/domain/value-objects/patient-phone-number";
import { PatientSurgeries } from "../../../patient/domain/value-objects/patient-surgeries";
import { PatientStatus } from "../../../patient/domain/value-objects/patient-status";
import { PatientGender } from "../../../patient/domain/value-objects/patient-gender";
import { OrmPatientMapper } from "../mappers/orm-patient-mapper";
import { InvalidPatientException } from "src/patient/domain/exceptions/invalid-patient.exception";


@EntityRepository(OrmPatient)
export class OrmPatientRepository extends Repository<OrmPatient> implements IPatientRepository {
    private readonly ormPatientMapper: OrmPatientMapper;

    constructor() {
        super();
        this.ormPatientMapper = new OrmPatientMapper();
    }
    
    //TODO: Implementar la busqueda de pacientes de un doctor
    findAsociatedPatients(asociated: SearchAssociatedPatientsDomainDto, options: RepositoryPagingDto): Promise<Patient[]> {
        throw new Error("Method not implemented.");
    }

    async saveAggregate(aggregate: Patient): Promise<void> {
        const ormPatient = await this.ormPatientMapper.fromDomainToOther(aggregate);
        await this.save(ormPatient);
    }

    async findOneById(id: PatientId): Promise<Patient> {
        const ormPatient = await this.findOne({where : {id: id.Value}});
        return (ormPatient) ? this.ormPatientMapper.fromOtherToDomain(ormPatient) : null;
    }

    async findOneByIdOrFail(id: PatientId): Promise<Patient> {
        const patient = await this.findOneById(id);
        if (!patient) {
            throw new InvalidPatientException();
        }
        return patient;
    }

}