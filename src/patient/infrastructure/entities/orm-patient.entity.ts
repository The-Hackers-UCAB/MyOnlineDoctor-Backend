import { PatientGender } from "../../../patient/domain/value-objects/patient-gender";
import { PatientStatus } from "../../../patient/domain/value-objects/patient-status";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'patients' })
export class OrmPatient {
    @PrimaryGeneratedColumn() id: number;

    @Column({ name: 'first_name', length: 32 }) firstName: string;

    @Column({ name: 'first_surname', length: 32 }) firstSurname: string;

    @Column({ type: 'enum', enum: PatientGender }) gender: PatientGender;

    @Column({ type: 'enum',enum: PatientStatus }) status: PatientStatus;

    @Column({ name: 'allergies' , length: 127}) allergies: string;

    @Column({ name: 'background', length: 127 }) background: string;

    @Column({name: 'birthdate', type: 'date'}) birthdate: Date;

    @Column({type: 'numeric', precision: 6, scale: 3}) height: number;

    @Column({ type: 'numeric', precision: 6, scale: 3 }) weight: number;

    @Column({ name: 'phoneNumber', length: 11 }) phoneNumber: string;

    @Column({name: 'surgeries', length: 127}) surgeries: string;

    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

    @Column({name:'middle_name', length: 32, nullable: true}) middleName: string;

    @Column ({name:'second_surname', length: 32, nullable: true}) secondSurname: string;


    static async create(
        id: number,
        firstName: string,
        firstSurname: string,
        gender: PatientGender,
        status: PatientStatus,
        allergies: string,
        background: string,
        birthdate: Date,
        height: number,
        weight: number,
        phoneNumber: string,
        surgeries: string,
        middleName: string,
        secondSurname: string
    ) : Promise<OrmPatient> {
        const ormPatient: OrmPatient = new OrmPatient();
        ormPatient.id = id;
        ormPatient.firstName = firstName;
        ormPatient.firstSurname = firstSurname;
        ormPatient.gender = gender;
        ormPatient.status = status;
        ormPatient.allergies = allergies;
        ormPatient.background = background;
        ormPatient.birthdate = birthdate;
        ormPatient.height = height;
        ormPatient.weight = weight;
        ormPatient.phoneNumber = phoneNumber;
        ormPatient.surgeries = surgeries;
        ormPatient.middleName = middleName;
        ormPatient.secondSurname = secondSurname;
        return ormPatient;
    }

}


