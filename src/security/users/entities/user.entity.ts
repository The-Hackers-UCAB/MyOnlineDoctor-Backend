import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/** UserEntity Es una entitdad de infraestructura utilizada únicamente para el manejo de seguridad. */
@Entity({ name: 'users' })
export class UserEntity {
    @Index() @PrimaryGeneratedColumn() id: number;

    @Column({ length: 255, unique: true }) email: string;

    @Column({ length: 255 }) password: string;


    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

    //Aqui van las referencias a las entidades de Doctor y Paciente
}