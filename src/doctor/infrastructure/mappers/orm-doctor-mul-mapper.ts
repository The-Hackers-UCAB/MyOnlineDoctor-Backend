import { IMapper } from "../../../core/application/mappers/mapper.interface";
import { Doctor } from "../../../doctor/domain/doctor";
import { OrmDoctor } from "../entities/orm-doctor.entity";
import { OrmDoctorMapper } from "./orm-doctor-mapper";

export class OrmDoctorMulMapper implements IMapper<Doctor[], OrmDoctor[]>{

    private readonly ormDoctorMapper: OrmDoctorMapper;

    constructor() {
        this.ormDoctorMapper = new OrmDoctorMapper();
    }

    async fromDomainToOther(domain: Doctor[]): Promise<OrmDoctor[]> {
        //Verificamos que no sea null
        if (!domain) { return null; }

        //Transformamos
        const ormDoctors: OrmDoctor[] = [];
        for await (const doctor of domain) {
            ormDoctors.push(await this.ormDoctorMapper.fromDomainToOther(doctor));
        }

        return ormDoctors;
    }

    async fromOtherToDomain(other: OrmDoctor[]): Promise<Doctor[]> {
        //Verificamos que no sea null
        if (!other) { return null; }

        //Transformamos
        const doctors: Doctor[] = [];
        for await (const ormDoctor of other) {
            doctors.push(await this.ormDoctorMapper.fromOtherToDomain(ormDoctor));
        }

        return doctors;
    }
}