import { IDomainService } from "../../../core/domain/domain-services/domain-service.interface";

export class DoctorRatingDomainService implements IDomainService<{ count: number, total: number }, number>{
    execute(dto: { count: number; total: number; }): number {
        return (dto.count > 0) ? (dto.total / dto.count) : 0;
    }
}