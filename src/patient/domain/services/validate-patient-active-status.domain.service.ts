import { IDomainService } from "../../../core/domain/domain-services/domain-service.interface";
import { Patient } from "../patient";
import { PatientStatus } from "../value-objects/patient-status";
import { PatientStatusEnum } from "../value-objects/patient-status.enum";

export class ValidatePatientActiveStatusDomainService implements IDomainService<Patient, boolean>{
    execute(dto: Patient): boolean {
        return dto.Status.equals(PatientStatus.create(PatientStatusEnum.ACTIVE));
    }
}