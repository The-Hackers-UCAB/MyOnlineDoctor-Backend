import { Column, CreateDateColumn, Entity, getManager, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { OrmDoctor } from "../../../doctor/infrastructure/entities/orm-doctor.entity";
import { OrmDoctorSpecialty } from "../../../doctor/infrastructure/entities/orm-doctor-specialty.entity";
import { OrmPatient } from "../../../patient/infrastructure/entities/orm-patient.entity";
import { OrmAppointment } from "../../../appointment/infrastructure/entities/orm.appointment.entity";
import { DoctorSpecialtyEnum } from "../../../doctor/domain/value-objects/doctor-specialty.enum";
import { OrmDoctorRepository } from "../../../doctor/infrastructure/repositories/orm-doctor.repository";
import { OrmPatientRepository } from "../../../patient/infrastructure/repositories/orm-patient.repository";
import { OrmAppointmentRepository } from "../../../appointment/infrastructure/repositories/orm-appointment.repository";

@Entity({ name: 'medical_records' })
export class OrmMedicalRecord {

    @PrimaryColumn({ type: 'uuid' }) id: string;

    @Column({ name: 'date' }) date: Date;
    @Column({ name: 'description', nullable: true }) description: string;
    @Column({ name: 'diagnostic', nullable: true }) diagnostic: string;
    @Column({ name: 'exams', nullable: true }) exams: string;
    @Column({ name: 'recipe', nullable: true }) recipe: string;
    @Column({ name: 'plannig', nullable: true }) plannig: string;

    @Column({ name: 'doctor_id' }) doctorId: string;
    @ManyToOne(() => OrmDoctor, { eager: true }) @JoinColumn({ name: 'doctor_id' }) doctor: OrmDoctor;
    @ManyToOne(() => OrmDoctorSpecialty, { eager: true }) @JoinColumn({ name: 'doctor_specialty' }) specialty: OrmDoctorSpecialty;

    @Column({ name: 'patient_id' }) patientId: string;
    @ManyToOne(() => OrmPatient, { eager: true }) @JoinColumn({ name: 'patient_id' }) patient: OrmPatient;

    @Column({ name: 'appointment_id' }) appointmentId: string;
    @OneToOne(() => OrmAppointment, { eager: true }) @JoinColumn({ name: 'appointment_id' }) appointment: OrmAppointment;

    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

    static async create(
        id: string,
        date: Date,
        description: string,
        diagnostic: string,
        exams: string,
        recipe: string,
        plannig: string,
        doctorId: string,
        patientId: string,
        appointmentId: string,
        doctorSpecialty?: DoctorSpecialtyEnum
    ): Promise<OrmMedicalRecord> {

        const ormMedicalRecord: OrmMedicalRecord = new OrmMedicalRecord();
        ormMedicalRecord.id = id;
        ormMedicalRecord.date = date;
        ormMedicalRecord.description = description;
        ormMedicalRecord.diagnostic = diagnostic;
        ormMedicalRecord.exams = exams;
        ormMedicalRecord.recipe = recipe;
        ormMedicalRecord.plannig = plannig;
        ormMedicalRecord.doctorId = doctorId;
        ormMedicalRecord.doctor = await getManager().getCustomRepository(OrmDoctorRepository).findOne({ where: { id: doctorId } });
        ormMedicalRecord.specialty = await getManager().getRepository(OrmDoctorSpecialty).findOne({ where: { specialty: doctorSpecialty } });
        ormMedicalRecord.patientId = patientId;
        ormMedicalRecord.patient = await getManager().getCustomRepository(OrmPatientRepository).findOne({ where: { id: patientId } });
        ormMedicalRecord.appointmentId = appointmentId;
        ormMedicalRecord.appointment = await getManager().getCustomRepository(OrmAppointmentRepository).findOne({ where: { id: appointmentId } });

        return ormMedicalRecord;
    }
}