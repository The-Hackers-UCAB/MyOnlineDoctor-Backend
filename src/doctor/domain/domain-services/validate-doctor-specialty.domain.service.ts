import { IDomainService } from "../../../core/domain/domain-services/domain-service.interface";
import { DoctorSpecialty } from "../value-objects/doctor-specialty";
import { Doctor } from "../doctor";

export class ValidateDoctorSpecialty implements IDomainService<{ specialty: DoctorSpecialty, doctor: Doctor }, boolean>{
    execute(dto: { specialty: DoctorSpecialty, doctor: Doctor }): boolean {
        dto.doctor.Specialties.forEach(specialty => {
            if (specialty.equals(dto.specialty)) {
                return true;
            }
        });
        return false;
    }
}