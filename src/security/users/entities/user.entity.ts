import { SessionEntity } from "src/security/auth/sessions/entities/session.entity";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/** UserEntity Es una entitdad de infraestructura (ORM) utilizada únicamente para el manejo de seguridad. */
@Entity({ name: 'users' })
export class UserEntity {
    @Index() @PrimaryGeneratedColumn() id: number;

    @Column({ length: 255, unique: true }) email: string;

    @Column({ length: 255 }) password: string;


    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;


    @OneToMany(() => SessionEntity, (sessionEntity) => sessionEntity.user) sessions: Promise<SessionEntity[]>;

    //Colocar las FKs a Doctor y Paciente (Arco exclusivo).
}