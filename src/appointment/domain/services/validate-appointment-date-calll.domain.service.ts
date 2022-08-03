import { IDomainService } from "../../../core/domain/services/domain.service.interface";
import { Appointment } from "../appointment";

export class ValidateAppointmentDateCallDomainService implements IDomainService<Appointment, boolean>{
    execute(dto: Appointment): boolean {
        if (dto.Date.Value < this.addHours(1, (new Date(Date.now())))) {
            return false;
        }
        return true;
    }

    private addHours(numOfHours, date: Date) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
        return date;
    }
}