import { AppointmentStatusEnum } from "src/appointment/domain/value-objects/appointment-status.enum";
import { AppointmentTypeEnum } from "src/appointment/domain/value-objects/appointment-type.enum";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";
import { OrmDoctorSpecialty } from "src/doctor/infrastructure/entities/orm-doctor-specialty.entity";
import { OrmDoctor } from "src/doctor/infrastructure/entities/orm-doctor.entity";
import { OrmPatient } from "src/patient/infrastructure/entities/orm-patient.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'appointments' })
export class OrmAppointment {

    @PrimaryColumn({ type: 'uuid' }) id: string;

    @Column({ name: 'date' }) date: Date;
    @Column({ name: 'description' }) description: string;
    @Column({ name: 'duration' }) duration: number;

    @Column({ type: 'enum', enum: AppointmentStatusEnum }) status: AppointmentStatusEnum;
    @Column({ type: 'enum', enum: AppointmentTypeEnum }) type: AppointmentTypeEnum;


    @Column({ name: 'doctor_id' }) doctorId: string;
    @OneToOne(() => OrmDoctor, { eager: true }) @JoinColumn({ name: 'doctor_id' }) doctor: OrmDoctor;


    @Column({ name: 'doctor_specialty' }) doctor_specialty: string;
    @OneToOne(() => OrmDoctorSpecialty, { eager: true }) @JoinColumn({ name: 'doctor_specialty' }) specialty: OrmDoctorSpecialty;

    @Column({ name: 'patient_id', nullable: true }) patientId: string;
    @OneToOne(() => OrmPatient, { eager: true }) @JoinColumn({ name: 'patient_id' }) patient: OrmPatient;


    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

    // TODO REVISAR AQUI
    static async create(id: string, date: Date, description: string, duration: number, status: AppointmentStatusEnum, type: AppointmentTypeEnum, patient: OrmPatient, doctor: OrmDoctor, doctorSpecialty?: OrmDoctorSpecialty): Promise<OrmAppointment> {
        const ormAppointment: OrmAppointment = new OrmAppointment();
        ormAppointment.id = id;
        ormAppointment.date = date;
        ormAppointment.description = description;
        ormAppointment.duration = duration;
        ormAppointment.status = status;
        ormAppointment.type = type;
        ormAppointment.patient = patient;
        ormAppointment.doctor = doctor;
        ormAppointment.specialty = doctorSpecialty;

        return ormAppointment;
    }

}