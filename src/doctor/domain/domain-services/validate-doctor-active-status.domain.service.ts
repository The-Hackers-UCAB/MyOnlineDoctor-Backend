import { IDomainService } from "../../../core/domain/services/domain.service.interface";
import { DoctorStatusEnum } from "../value-objects/doctor-status.enum";
import { DoctorStatus } from "../value-objects/doctor-status";
import { Doctor } from "../doctor";

export class ValidateDoctorActiveStatusDomainService implements IDomainService<Doctor, boolean>{
    execute(dto: Doctor): boolean {
        return dto.Status.equals(DoctorStatus.create(DoctorStatusEnum.ACTIVE));
    }
}