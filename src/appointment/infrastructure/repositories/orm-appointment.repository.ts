import { IAppointmentRepository } from "../../../appointment/application/repositories/appointment.repository.interface";
import { EntityRepository, Repository } from "typeorm";
import { OrmAppointment } from "../entities/orm.appointment.entity";
import { Appointment } from "../../../appointment/domain/appointment";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { OrmAppointmentMapper } from "../mappers/orm-appointment.mapper";
import { InvalidAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-exception";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { PatientId } from "src/patient/domain/value-objects/patient-id";
import { OrmAppointmentMulMapper } from "../mappers/orm-appointment-mul.mapper";

@EntityRepository(OrmAppointment)
export class OrmAppointmentRepository extends Repository<OrmAppointment> implements IAppointmentRepository {
    private readonly ormAppointmentMapper: OrmAppointmentMapper = new OrmAppointmentMapper();
    private readonly ormAppointmentMulMapper: OrmAppointmentMulMapper = new OrmAppointmentMulMapper();

    async saveAggregate(aggregate: Appointment): Promise<void> {
        const ormAppointment = await this.ormAppointmentMapper.fromDomainToOther(aggregate);
        await this.save(ormAppointment);
    }

    async findOneById(id: AppointmentId): Promise<Appointment> {
        const ormAppointment = await this.findOne({ where: { id: id.Value } });
        return await this.ormAppointmentMapper.fromOtherToDomain(ormAppointment);
    }

    async findOneByIdOrFail(id: AppointmentId): Promise<Appointment> {
        const ormAppointment = await this.findOneById(id);
        if (!ormAppointment) { throw new InvalidAppointmentException(); }
        return ormAppointment;
    }

    async findPatientAppointments(id: PatientId): Promise<Appointment[]> {
        const ormAppointments = await this.find({ where: { patientId: id.Value } });
        return await this.ormAppointmentMulMapper.fromOtherToDomain(ormAppointments);
    }

    async findDoctorAppointments(id: DoctorId): Promise<Appointment[]> {
        const ormAppointments = await this.find({ where: { doctorId: id.Value } });
        return await this.ormAppointmentMulMapper.fromOtherToDomain(ormAppointments);
    }
}