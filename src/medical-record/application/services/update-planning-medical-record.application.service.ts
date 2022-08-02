import { IApplicationService } from "src/core/application/application-service/application.service.interface";
import { IMedicalRecordRepository } from "../repositories/medical-record.repository.interface";
import { IDoctorRepository } from "src/doctor/application/repositories/doctor.repository.inteface";
import { IEventHandler } from "src/core/application/event-handler/event-handler.interface";
import { Result } from "src/core/application/result-handler/result";
import { MedicalRecordID } from "src/medical-record/domain/value-objects/medical-record-id";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { MedicalRecordPlanning } from "src/medical-record/domain/value-objects/medical-record-planning";
import { InvalidDoctorException } from "src/doctor/domain/exceptions/invalid-doctor.exception";

//#region Service DTOs
export interface UpdatePlanningMedicalRecordApplicationServiceDto {
    id?: string,
    planning?: string,
    doctorId?: string,
}
//#endregion

export class UpdatePlanningMedicalRecordApplicationService implements IApplicationService<UpdatePlanningMedicalRecordApplicationServiceDto, string>{

    get name(): string { return this.constructor.name; }

    constructor(
        private readonly medicalRecordRepository: IMedicalRecordRepository,
        private readonly doctorRepository: IDoctorRepository,
        private readonly eventHandler: IEventHandler
    ) { }

    async execute(dto: UpdatePlanningMedicalRecordApplicationServiceDto): Promise<Result<string>> {
        
        const medicalRecord = await this.medicalRecordRepository.findOneByIdOrFail(MedicalRecordID.create(dto.id));

        //Verifico que el doctor sea el mismo que el que creo el registro
        const doctor = await this.doctorRepository.findOneByIdOrFail(DoctorId.create(dto.doctorId));

        if (!doctor.Id.equals(medicalRecord.Doctor.Id)) {
            throw new InvalidDoctorException();
        }

        //Actualizo el registro
        medicalRecord.updatePlanning(MedicalRecordPlanning.create(dto.planning));

        //Guardo el registro
        this.medicalRecordRepository.saveAggregate(medicalRecord);

        //Publico los eventos
        this.eventHandler.publish(medicalRecord.pullEvents());

        //Retorno el resultado
        return Result.success('Planificacion de registro actualizados');
    }
}