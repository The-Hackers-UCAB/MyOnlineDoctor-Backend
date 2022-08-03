import { UUIDGenerator } from "src/core/infrastructure/uuid/uuid-generator";
import { Doctor } from "src/doctor/domain/doctor";
import { DoctorGender } from "src/doctor/domain/value-objects/doctor-gender";
import { DoctorGenderEnum } from "src/doctor/domain/value-objects/doctor-gender.enum";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { DoctorLocation } from "src/doctor/domain/value-objects/doctor-location";
import { DoctorNames } from "src/doctor/domain/value-objects/doctor-names";
import { DoctorRating } from "src/doctor/domain/value-objects/doctor-rating";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";
import { DoctorSpecialtyEnum } from "src/doctor/domain/value-objects/doctor-specialty.enum";
import { DoctorStatus } from "src/doctor/domain/value-objects/doctor-status";
import { DoctorStatusEnum } from "src/doctor/domain/value-objects/doctor-status.enum";
import { DoctorSurnames } from "src/doctor/domain/value-objects/doctor-surnames";

export class DoctorObjectMother {
    static createActiveDoctor() {
        const uuid = new UUIDGenerator();

        const dto = { specialties: [DoctorSpecialtyEnum.CARDIOLOGY, DoctorSpecialtyEnum.NEPHROLOGY] };

        const specialties: DoctorSpecialty[] = [];
        dto.specialties.forEach((specialty) => {
            specialties.push(DoctorSpecialty.create(specialty));
        });

        const doctor = Doctor.create(
            DoctorId.create(uuid.generate()),
            DoctorNames.create("First Name", "Middle Name"),
            DoctorSurnames.create("First Surname", "Second Surname"),
            DoctorLocation.create(10, 10),
            DoctorRating.create(0),
            DoctorGender.create(DoctorGenderEnum.MALE),
            DoctorStatus.create(DoctorStatusEnum.ACTIVE),
            specialties
        );

        return doctor;
    }

    static createBlockedDoctor() {
        const uuid = new UUIDGenerator();

        const dto = { specialties: [DoctorSpecialtyEnum.CARDIOLOGY, DoctorSpecialtyEnum.NEPHROLOGY] };

        const specialties: DoctorSpecialty[] = [];
        dto.specialties.forEach((specialty) => {
            specialties.push(DoctorSpecialty.create(specialty));
        });

        const doctor = Doctor.create(
            DoctorId.create(uuid.generate()),
            DoctorNames.create("First Name", "Middle Name"),
            DoctorSurnames.create("First Surname", "Second Surname"),
            DoctorLocation.create(10, 10),
            DoctorRating.create(0),
            DoctorGender.create(DoctorGenderEnum.MALE),
            DoctorStatus.create(DoctorStatusEnum.BLOCKED),
            specialties
        );

        return doctor;
    }
}