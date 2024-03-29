import { IAppointmentRepository } from "../../../appointment/application/repositories/appointment.repository.interface";
import { EntityRepository, IsNull, Not, Repository } from "typeorm";
import { OrmAppointment } from "../entities/orm.appointment.entity";
import { Appointment } from "../../../appointment/domain/appointment";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { OrmAppointmentMapper } from "../mappers/orm-appointment.mapper";
import { InvalidAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-exception";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { OrmAppointmentMulMapper } from "../mappers/orm-appointment-mul.mapper";
import { Patient } from "../../../../src/patient/domain/patient";
import { OrmPatientMulMapper } from "../../../../src/patient/infrastructure/mappers/orm-patient-mul-mapper";
import { OrmPatient } from "../../../../src/patient/infrastructure/entities/orm-patient.entity";

@EntityRepository(OrmAppointment)
export class OrmAppointmentRepository extends Repository<OrmAppointment> implements IAppointmentRepository {
    private readonly ormAppointmentMapper: OrmAppointmentMapper = new OrmAppointmentMapper();
    private readonly ormAppointmentMulMapper: OrmAppointmentMulMapper = new OrmAppointmentMulMapper();
    private readonly ormPatientMulMapper: OrmPatientMulMapper = new OrmPatientMulMapper();

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
        const ormAppointments = await this.find({ where: { patientId: id.Value }, order: { updatedAt: 'DESC' } });
        return await this.ormAppointmentMulMapper.fromOtherToDomain(ormAppointments);
    }

    async findDoctorAppointments(id: DoctorId): Promise<Appointment[]> {
        const ormAppointments = await this.find({ where: { doctorId: id.Value }, order: { updatedAt: 'DESC' } });
        return await this.ormAppointmentMulMapper.fromOtherToDomain(ormAppointments);
    }

    /**Cuenta las citas del doctor y el total de rating
     * @param id El id del doctor
     * @returns `Retorna el numero total de citas y la suma de todas las calificaciones de la misma` en un objeto*/
    async findDoctorAppointmentsAndCount(id: DoctorId): Promise<{ total: number, total_rating: number }> {
        const ormAppointments = await this.findAndCount({ where: { doctorId: id.Value, rating: Not(IsNull()) } });
        let total: number = 0;
        for await (const ormAppointment of ormAppointments[0]) {
            total += Number.parseFloat("" + ormAppointment.rating);
        }
        return { total: ormAppointments[1], total_rating: total };
    }

    async findDoctorPatients(id: DoctorId) : Promise<Patient[]> {
        const query = await this.createQueryBuilder('appointments')
        .select('p.*')
        .leftJoin("appointments.patient", "p")
        .distinctOn(['p.id'])
        .where("appointments.doctor_id = :id", { id: id.Value })
        .getRawMany();

        const patients: OrmPatient[] = [];

        for (let i = 0; i < query.length; i++) {
            const patient = query[i];
            patients.push({
                firstName: patient['first_name'],
                middleName: patient['middle_name'],
                firstSurname: patient['first_surname'],
                secondSurname: patient['second_surname'],
                phoneNumber: patient['phonenumber'],
                createdAt: patient['created_at'],
                updatedAt: patient['updated_at'],
                ...patient
            })
        }

        return this.ormPatientMulMapper.fromOtherToDomain(patients);
    
    }
}