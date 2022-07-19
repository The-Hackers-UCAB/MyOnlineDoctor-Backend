import { AppointmentStatusEnum } from "src/appointment/domain/value-objects/appointment-status.enum";
import { AppointmentTypeEnum } from "src/appointment/domain/value-objects/appointment-type.enum";
import { DoctorSpecialtyEnum } from "src/doctor/domain/value-objects/doctor-specialty.enum";
import { OrmDoctorSpecialty } from "src/doctor/infrastructure/entities/orm-doctor-specialty.entity";
import { OrmDoctor } from "src/doctor/infrastructure/entities/orm-doctor.entity";
import { OrmDoctorRepository } from "src/doctor/infrastructure/repositories/orm-doctor.repository";
import { OrmPatient } from "src/patient/infrastructure/entities/orm-patient.entity";
import { OrmPatientRepository } from "src/patient/infrastructure/repositories/orm-patient.repository";
import { Column, CreateDateColumn, Entity, getManager, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'appointments' })
export class OrmAppointment {

    @PrimaryColumn({ type: 'uuid' }) id: string;

    @Column({ name: 'date', nullable: true }) date: Date;
    @Column({ name: 'description' }) description: string;
    @Column({ name: 'duration', nullable: true }) duration: number;

    @Column({ type: 'enum', enum: AppointmentStatusEnum }) status: AppointmentStatusEnum;
    @Column({ type: 'enum', enum: AppointmentTypeEnum }) type: AppointmentTypeEnum;

    @Column({ type: 'numeric', precision: 6, scale: 3, nullable: true }) rating: number;

    @Column({ name: 'doctor_id' }) doctorId: string;
    @ManyToOne(() => OrmDoctor, { eager: true }) @JoinColumn({ name: 'doctor_id' }) doctor: OrmDoctor;

    @ManyToOne(() => OrmDoctorSpecialty, { eager: true }) @JoinColumn({ name: 'doctor_specialty' }) specialty: OrmDoctorSpecialty;

    @Column({ name: 'patient_id' }) patientId: string;
    @ManyToOne(() => OrmPatient, { eager: true }) @JoinColumn({ name: 'patient_id' }) patient: OrmPatient;


    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

    // TODO REVISAR AQUI
    static async create(id: string, date: Date, description: string, duration: number, status: AppointmentStatusEnum, type: AppointmentTypeEnum, patientId: string, doctorId: string, rating: number | null, doctorSpecialty?: DoctorSpecialtyEnum): Promise<OrmAppointment> {
        const ormAppointment: OrmAppointment = new OrmAppointment();
        ormAppointment.id = id;
        ormAppointment.date = date;
        ormAppointment.description = description;
        ormAppointment.duration = duration;
        ormAppointment.status = status;
        ormAppointment.type = type;
        ormAppointment.patientId = patientId;
        ormAppointment.patient = await getManager().getCustomRepository(OrmPatientRepository).findOne({ where: { id: patientId } })
        ormAppointment.doctorId = doctorId;
        ormAppointment.rating = rating;
        ormAppointment.doctor = await getManager().getCustomRepository(OrmDoctorRepository).findOne({ where: { id: doctorId } });
        ormAppointment.specialty = await getManager().getRepository(OrmDoctorSpecialty).findOne({ where: { specialty: doctorSpecialty } });

        return ormAppointment;
    }
}