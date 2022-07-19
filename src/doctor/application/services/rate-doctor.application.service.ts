import { IAppointmentRepository } from 'src/appointment/application/repositories/appointment.repository.interface';
import { IApplicationService } from 'src/core/application/application-service/application.service.interface';
import { IEventHandler } from 'src/core/application/event-handler/event-handler.interface';
import { Result } from '../../../core/application/result-handler/result';
import { DoctorRatingDomainService } from '../../domain/domain-services/doctor-rating.domain.service';
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { IDoctorRepository } from '../repositories/doctor.repository.inteface';
import { DoctorRating } from 'src/doctor/domain/value-objects/doctor-rating';



//#region Service DTOs
export interface DoctorRatingApplicationServiceDto {
    doctorId: string;
}
//#endregion

export class DoctorRatingApplicationService implements IApplicationService<DoctorRatingApplicationServiceDto, string> {
    private readonly doctorRatingDomainService: DoctorRatingDomainService = new DoctorRatingDomainService();

    get name(): string { return this.constructor.name; }

    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly eventHandler: IEventHandler,
        private readonly doctorRepository: IDoctorRepository
        ) 
    { }
    //Se ejecuta el servicio de dominio
    async execute(dto: DoctorRatingApplicationServiceDto): Promise<Result<string>> {
        
        //Se obtiene el doctor
        const doctor = await this.doctorRepository.findOneByIdOrFail(DoctorId.create(dto.doctorId));
        //Se obtiene el numero total de citas y la suma de todas las calificaciones de la misma
        const doctorRating = await this.appointmentRepository.findDoctorAppointmentsAndCount(doctor.Id);

        //Se ejecuta el servicio de dominio
        const result = this.doctorRatingDomainService.execute({count: doctorRating.total, total: doctorRating.total_rating});
        
        //Se actualiza el rating del doctor
        doctor.updateRating(DoctorRating.create(result));

        //Se guarda el doctor con el rating actualizado
        this.doctorRepository.saveAggregate(doctor);
        
        //Se publica el evento
        this.eventHandler.publish(doctor.pullEvents());

        //Se retorna el resultado
        return Result.success('Rating del doctor '+result);
        
    }
}