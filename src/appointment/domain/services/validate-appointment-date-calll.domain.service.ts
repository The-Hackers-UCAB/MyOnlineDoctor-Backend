import { IDomainService } from "../../../core/domain/services/domain.service.interface";
import { Appointment } from "../appointment";

export class ValidateAppointmentDateCallDomainService implements IDomainService<Appointment, boolean>{
    execute(dto: Appointment): boolean {
        if (dto.Date.Value < (new Date(Date.now()))) {
            return false;
        }
        return true;
    }
}