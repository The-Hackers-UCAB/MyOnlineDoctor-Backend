import { RepositoryPagingDto } from "src/core/application/repositories/repository-paging.dto";
import { Doctor } from "src/doctor/domain/doctor";
import { InvalidDoctorException } from "src/doctor/domain/exceptions/invalid-doctor.exception";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { IDoctorRepository, SearchDoctorsByCriteriaDomainDto } from "src/doctor/application/repositories/doctor.repository.inteface";

export class DoctorRepositoryMock implements IDoctorRepository {
    private readonly doctors: Doctor[] = [];

    async findDoctorByCriterias(criterias: SearchDoctorsByCriteriaDomainDto, options: RepositoryPagingDto): Promise<Doctor[]> {
        return null;
    }
    async saveAggregate(aggregate: Doctor): Promise<void> {
        this.doctors.push(aggregate);
    }
    async findOneById(id: DoctorId): Promise<Doctor> {
        for (let i = 0; i < this.doctors.length; i++) {
            const doctor = this.doctors[i];
            if (doctor.Id.equals(id)) { return doctor; }
        }
    }
    async findOneByIdOrFail(id: DoctorId): Promise<Doctor> {
        const doctor = await this.findOneById(id);
        if (!doctor) { throw new InvalidDoctorException(); }
        return doctor;
    }
}