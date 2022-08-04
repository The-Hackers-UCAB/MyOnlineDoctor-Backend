import { IAppointmentRepository } from "../../../../src/appointment/application/repositories/appointment.repository.interface";
import { IApplicationService } from "../../../../src/core/application/application-service/application.service.interface";
import { Result } from "../../../../src/core/application/result-handler/result";
import { DoctorId } from "../../../../src/doctor/domain/value-objects/doctor-id";
import { Patient } from "../../../../src/patient/domain/patient";



export interface SearchDoctorPatientsApplicationServiceDto {

    id? : string

}

export class SearchDoctorPatientsApplicationService implements IApplicationService<SearchDoctorPatientsApplicationServiceDto, Patient[]> {

    get name() : string { return this.constructor.name }

    constructor( private readonly appointmentRepository: IAppointmentRepository ){ }

    async execute(dto: SearchDoctorPatientsApplicationServiceDto) : Promise<Result<Patient[]>>{
        const patients = await this.appointmentRepository.findDoctorPatients(DoctorId.create(dto.id));

        return Result.success(patients);   
    }

}