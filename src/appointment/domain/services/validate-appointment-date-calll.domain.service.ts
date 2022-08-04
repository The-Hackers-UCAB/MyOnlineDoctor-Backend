import { IDomainService } from "../../../core/domain/services/domain.service.interface";
import { Appointment } from "../appointment";

export class ValidateAppointmentDateCallDomainService implements IDomainService<Appointment, boolean>{
    execute(dto: Appointment): boolean {

        if (dto.Date.Value < (new Date(Date.now()))) {
            return false;
        }

        let extraTime = dto.Date.Value;
        extraTime.setHours(extraTime.getHours() + dto.Duration.Value + 1);

        if (extraTime > (new Date(Date.now()))) {
            return false;
        }

        return true;
    }
}