import { IDomainService } from "../../../core/domain/services/domain.service.interface";
import { DoctorSpecialty } from "../value-objects/doctor-specialty";
import { Doctor } from "../doctor";

export class ValidateDoctorSpecialty implements IDomainService<{ specialty: DoctorSpecialty, doctor: Doctor }, boolean>{
    execute(dto: { specialty: DoctorSpecialty, doctor: Doctor }): boolean {
        for (let index = 0; index < dto.doctor.Specialties.length; index++) {
            const element = dto.doctor.Specialties[index];
            if (element.equals(dto.specialty)) {
                return true;
            }
        }

        return false;
    }
}