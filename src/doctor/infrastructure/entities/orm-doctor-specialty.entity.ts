import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DoctorSpecialtyEnum } from "src/doctor/domain/value-objects/doctor-specialty.enum";

@Entity({ name: 'doctor_specialties' })
export class OrmDoctorSpecialty {
    @Index() @PrimaryGeneratedColumn() id: number;

    @Column({ type: 'enum', enum: DoctorSpecialtyEnum, unique: true }) specialty: DoctorSpecialtyEnum;

    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}