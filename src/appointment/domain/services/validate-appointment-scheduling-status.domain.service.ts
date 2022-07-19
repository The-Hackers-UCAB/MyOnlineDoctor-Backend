import { IDomainService } from "../../../core/domain/services/domain.service.interface";
import { Appointment } from "../appointment";
import { InvalidAppointmentException } from "../exceptions/invalid-appointment-exception";
import { AppointmentStatusEnum } from "../value-objects/appointment-status.enum";

export class ValidateAppointmentSchedulingStatusDomainService implements IDomainService<Appointment, void>{
    execute(dto: Appointment): void {
        if (dto.Status.Value != AppointmentStatusEnum.REQUESTED) {
            throw new InvalidAppointmentException();
        }
    }
}