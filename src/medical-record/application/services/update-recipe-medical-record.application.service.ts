import { IApplicationService } from "src/core/application/application-service/application.service.interface";
import { IEventHandler } from "src/core/application/event-handler/event-handler.interface";
import { Result } from "src/core/application/result-handler/result";
import { IDoctorRepository } from "src/doctor/application/repositories/doctor.repository.inteface";
import { InvalidDoctorException } from "src/doctor/domain/exceptions/invalid-doctor.exception";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { MedicalRecordID } from "src/medical-record/domain/value-objects/medical-record-id";
import { MedicalRecordRecipe } from "src/medical-record/domain/value-objects/medical-record-recipe";
import { IMedicalRecordRepository } from "../repositories/medical-record.repository.interface";

//#region Service DTOs
export interface UpdateRecipeMedicalRecordApplicationServiceDto {
    id?: string,
    recipe?: string,
    doctorId?: string,
}
//#endregion

export class UpdateRecipeMedicalRecordApplicationService implements IApplicationService<UpdateRecipeMedicalRecordApplicationServiceDto,string>{

    get name(): string { return this.constructor.name; }

    constructor(
        private readonly medicalRecordRepository: IMedicalRecordRepository,
        private readonly doctorRepository: IDoctorRepository,
        private readonly eventHandler: IEventHandler
    ) { }

    async execute(dto: UpdateRecipeMedicalRecordApplicationServiceDto): Promise<Result<string>> {
        
        const medicalRecord = await this.medicalRecordRepository.findOneByIdOrFail(MedicalRecordID.create(dto.id));
        
        //Verifico que el doctor sea el mismo que el que creo el registro
        const doctor = await this.doctorRepository.findOneByIdOrFail(DoctorId.create(dto.doctorId));

        if (!doctor.Id.equals(medicalRecord.Doctor.Id)) {
            throw new InvalidDoctorException();
        }

        //Actualizo el registro
        medicalRecord.updateRecipe(MedicalRecordRecipe.create(dto.recipe));

        //Guardo el registro
        this.medicalRecordRepository.saveAggregate(medicalRecord);

        //Publico los eventos
        this.eventHandler.publish(medicalRecord.pullEvents());

        //Retorno el resultado
        return Result.success('Examenes de registro actualizados');
    }
}