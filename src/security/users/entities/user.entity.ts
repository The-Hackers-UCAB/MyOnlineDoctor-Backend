import { Check, Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrmDoctor } from "../../../doctor/infrastructure/entities/orm-doctor.entity";
import { OrmPatient } from "../../../patient/infrastructure/entities/orm-patient.entity";
import { SessionEntity } from "../../../security/auth/sessions/entities/session.entity";
import { Role } from "../roles/role.entity.enum";

/** UserEntity Es una entitdad de infraestructura (ORM) utilizada únicamente para el manejo de seguridad. */
@Entity({ name: 'users' })
@Check(`("role" = 'Doctor' AND "doctor_id" IS NOT NULL) OR ("role" = 'Paciente' AND "patient_id" IS NOT NULL) OR ("role" = 'Admin' AND "doctor_id" IS NULL AND "patient_id" IS NULL)`)
export class UserEntity {
    @Index() @PrimaryGeneratedColumn() id: number;

    @Column({ length: 255, unique: true, nullable: false }) email: string;

    @Column({ length: 255, nullable: false }) password: string;

    @Column({ type: 'enum', enum: Role, nullable: false }) role: Role;

    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;


    @OneToMany(() => SessionEntity, (sessionEntity) => sessionEntity.user) sessions: Promise<SessionEntity[]>;


    @Column({ name: 'doctor_id', nullable: true }) doctorId: string;

    @OneToOne(() => OrmDoctor, { eager: true, nullable: true }) @JoinColumn({ name: 'doctor_id' }) doctor: OrmDoctor;


    @Column({ name: 'patient_id', nullable: true }) patientId: string;

    @OneToOne(() => OrmPatient, { eager: true, nullable: true }) @JoinColumn({ name: 'patient_id' }) patient: OrmPatient;
}