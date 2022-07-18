import { Appointment } from "../../../appointment/domain/appointment";
import { IMapper } from "../../../core/application/mappers/mapper.interface";
import { OrmAppointment } from "../entities/orm.appointment.entity";
import { OrmAppointmentMapper } from "./orm-appointment.mapper";

export class OrmAppointmentMulMapper implements IMapper<Appointment[], OrmAppointment[]>{

    private readonly ormAppointmentMapper: OrmAppointmentMapper;

    constructor() {
        this.ormAppointmentMapper = new OrmAppointmentMapper();
    }

    async fromDomainToOther(domain: Appointment[]): Promise<OrmAppointment[]> {
        if (!domain) { return null; }

        const ormAppointments: OrmAppointment[] = [];
        for await (const appointment of domain) {
            ormAppointments.push(await this.ormAppointmentMapper.fromDomainToOther(appointment));
        }

        return ormAppointments;
    }

    async fromOtherToDomain(other: OrmAppointment[]): Promise<Appointment[]> {
        if (!other) { return null; }

        const appointment: Appointment[] = [];
        for await (const ormAppointment of other) {
            appointment.push(await this.ormAppointmentMapper.fromOtherToDomain(ormAppointment));
        }

        return appointment;
    }
}