import { DoctorSpecialty } from "../../domain/value-objects/doctor-specialty";
import { Column, CreateDateColumn, Entity, getManager, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrmDoctorSpecialty } from "./orm-doctor-specialty.entity";
import { DoctorGenderEnum } from "../../../doctor/domain/value-objects/doctor-gender.enum";
import { DoctorStatusEnum } from "../../../doctor/domain/value-objects/doctor-status.enum";

@Entity({ name: 'doctors' })
export class OrmDoctor {
    @Index() @PrimaryGeneratedColumn() id: number;

    @Column({ name: 'first_name', length: 32 }) firstName: string;

    @Column({ name: 'first_surname', length: 32 }) firstSurname: string;


    @Column({ type: 'enum', enum: DoctorGenderEnum }) gender: DoctorGenderEnum;

    @Column({ type: 'enum', enum: DoctorStatusEnum }) status: DoctorStatusEnum;


    @Column({ type: 'numeric', precision: 6, scale: 3 }) latitude: number;

    @Column({ type: 'numeric', precision: 6, scale: 3 }) longitude: number;


    @Column({ type: 'numeric', precision: 6, scale: 3 }) rating: number;


    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;


    @JoinTable()
    @ManyToMany(() => OrmDoctorSpecialty, (ormDoctorSpecialty) => ormDoctorSpecialty.specialty, { eager: true, cascade: true }) specialties: OrmDoctorSpecialty[];


    @Column({ name: 'middle_name', length: 32, nullable: true }) middleName: string;

    @Column({ name: 'second_surname', length: 32, nullable: true }) secondSurname: string;

    static async create(id: number, firstName: string, firstSurname: string, gender: DoctorGenderEnum, status: DoctorStatusEnum, latitude: number, longitude: number, rating: number, specialties: DoctorSpecialty[], middleName?: string, secondSurname?: string): Promise<OrmDoctor> {
        const ormDoctor: OrmDoctor = new OrmDoctor();
        ormDoctor.id = id;
        ormDoctor.firstName = firstName;
        ormDoctor.firstSurname = firstSurname;
        ormDoctor.gender = gender;
        ormDoctor.status = status;
        ormDoctor.latitude = latitude;
        ormDoctor.longitude = longitude;
        ormDoctor.rating = rating;
        ormDoctor.middleName = middleName;
        ormDoctor.secondSurname = secondSurname;

        //Buscamos las OrmSpecialties y las asignamos a la entidad.
        ormDoctor.specialties = [];
        const specialtyRepository = await getManager().getRepository(OrmDoctorSpecialty);
        for await (const specialty of specialties) {
            const ormSpecialty: OrmDoctorSpecialty = await specialtyRepository.findOne({ where: { specialty: specialty.Value } });
            if (ormSpecialty) {
                ormDoctor.specialties.push(ormSpecialty);
            }
        }

        return ormDoctor;
    }
}