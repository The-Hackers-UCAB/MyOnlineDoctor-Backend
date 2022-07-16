import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DoctorSpecialty } from "../../../doctor/domain/value-objects/doctor-specialty.enum";

@Entity({ name: 'doctor_specialty' })
export class OrmDoctorSpecialty {
    @Index() @PrimaryGeneratedColumn() id: number;

    @Column({ type: 'enum', enum: DoctorSpecialty, unique: true }) specialty: DoctorSpecialty;

    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}