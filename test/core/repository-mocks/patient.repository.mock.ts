import { RepositoryPagingDto } from "../../../src/core/application/repositories/repository-paging.dto";
import { Patient } from "../../../src/patient/domain/patient";
import { PatientId } from "../../../src/patient/domain/value-objects/patient-id";
import { IPatientRepository, SearchAssociatedPatientsDomainDto } from "../../../src/patient/application/repositories/patient.repository.interface";
import { InvalidPatientException } from "../../../src/patient/domain/exceptions/invalid-patient.exception";

export class PatientRepositoryMock implements IPatientRepository {

    private readonly patients: Patient[] = [];

    async findAsociatedPatients(asociated: SearchAssociatedPatientsDomainDto, options: RepositoryPagingDto): Promise<Patient[]> {
        return null;
    }
    async saveAggregate(aggregate: Patient): Promise<void> {
        this.patients.push(aggregate);
    }
    async findOneById(id: PatientId): Promise<Patient> {
        for (let i = 0; i < this.patients.length; i++) {
            const patient = this.patients[i];
            if (patient.Id.equals(id)) { return patient; }
        }
    }
    async findOneByIdOrFail(id: PatientId): Promise<Patient> {
        const patient = await this.findOneById(id);
        if (!patient) { throw new InvalidPatientException(); }
        return patient;
    }
}